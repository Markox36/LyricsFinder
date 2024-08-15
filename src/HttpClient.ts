import { randomBytes } from "node:crypto";
import https from "node:https";
import os from "node:os";
import axios, { AxiosError } from "axios";
import { Address6 } from "ip-address";

interface FetchOptions {
	url: string;
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	headers?: Record<string, string>;
	body?: string | FormData | URLSearchParams | any;
}

class FetchClient {
	private async customFetch<ResponseJSON>(config: FetchOptions): Promise<ResponseJSON> {
		const url = `${config.url}`;

		Reflect.deleteProperty(config, "url");

		return fetch(url, config).then(async (response) => {
			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const contentType = response.headers.get("Content-Type");
			switch (contentType) {
				case "text/plain":
					return (await response.text()) as unknown as Promise<ResponseJSON>;
				case "application/octet-stream":
					return (await response.arrayBuffer()) as unknown as Promise<ResponseJSON>;
				case "multipart/form-data":
				case "application/x-www-form-urlencoded":
					return (await response.formData()) as unknown as Promise<ResponseJSON>;
				default:
					return (await response.json()) as Promise<ResponseJSON>;
			}
		});
	}

	async get<ResponseJSON>(config: Omit<FetchOptions, "method">): Promise<ResponseJSON> {
		return this.customFetch<ResponseJSON>({ ...config, method: "GET" });
	}

	async post<ResponseJSON>(config: Omit<FetchOptions, "method">): Promise<ResponseJSON> {
		return this.customFetch<ResponseJSON>({ ...config, method: "POST" });
	}

	async patch<ResponseJSON>(config: Omit<FetchOptions, "method">): Promise<ResponseJSON> {
		return this.customFetch<ResponseJSON>({ ...config, method: "PATCH" });
	}

	async put<ResponseJSON>(config: Omit<FetchOptions, "method">): Promise<ResponseJSON> {
		return this.customFetch<ResponseJSON>({ ...config, method: "PUT" });
	}

	async delete<ResponseJSON>(config: Omit<FetchOptions, "method">): Promise<ResponseJSON> {
		return this.customFetch<ResponseJSON>({ ...config, method: "DELETE" });
	}
}

interface AxiosOptions {
	url: string;
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	headers?: Record<string, string>;
	data?: string | FormData | URLSearchParams | any;
	params?: Record<string, string>;
	httpAgent?: any;
	httpsAgent?: any;
	timeout?: number;
	advanced?: {
		useIpRotation?: boolean;
		changeIpAfterRequests?: number;
		changeIp?: boolean;
	};
}

class AxiosClient {
	private ip: string | undefined;
	private requestCount = 0;
	private readonly ipv6_block: string[];

	constructor({ ipv6_block }: { ipv6_block: string[] }) {
		this.ipv6_block = ipv6_block;
	}

	public reloadIP() {
		this.ip = this.getRandomIpFromBlock(this.ipv6_block[Math.floor(Math.random() * this.ipv6_block.length)]);
		console.log("Reloading IP to:", this.ip);
	}

	private getRandomIpFromBlock(block: string) {
		if (!block) {
			throw new Error("No block provided");
		}

		try {
			const blockIPv6 = new Address6(block);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
			const baseInteger = BigInt(blockIPv6.bigInteger().toString());
			const endAddress = blockIPv6.endAddress();

			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
			const endInteger = BigInt(endAddress.bigInteger().toString());
			const totalIps = endInteger - baseInteger;

			if (totalIps === BigInt(0)) {
				throw new Error("The IP block range is zero, cannot generate a random IP.");
			}

			const byteLength = Math.ceil(totalIps.toString(16).length / 2);

			const randomOffset = randomBytes(byteLength);
			let offset = BigInt(`0x${randomOffset.toString("hex")}`);

			offset %= totalIps;

			const randomIpInteger = baseInteger + offset;

			return Address6.fromBigInteger(randomIpInteger).correctForm();
		} catch (error: unknown) {
			const { message } = error as { message: string };
			console.error("Invalid IP block:", message);

			throw new Error("Invalid IP block provided.");
		}
	}

	private checkPlatform(): boolean {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		if (os.platform() !== "linux") {
			throw new Error("IP rotation is only supported on Linux systems.");
		}

		return true;
	}

	private async customAxios<ResponseJSON>(config: AxiosOptions): Promise<ResponseJSON> {
		if (this.ipv6_block.length && config?.advanced?.useIpRotation) {
			if (
				config?.advanced?.changeIp ||
				!this.ip ||
				(config.advanced.changeIpAfterRequests && this.requestCount >= config.advanced.changeIpAfterRequests)
			) {
				this.reloadIP();
				this.requestCount = 0;
			}

			this.checkPlatform();

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			const agent = new https.Agent({
				localAddress: this.ip || "0.0.0.0"
			});

			config.httpAgent = agent;
			config.httpsAgent = agent;
			this.requestCount++;
		}

		config.timeout = 10000;

		return axios<ResponseJSON>(config)
			.then((response) => response.data)
			.catch((error: unknown) => {
				if (error instanceof AxiosError) {
					const { response } = error;
					const errorMessage = response?.data?.error?.message as string | undefined;

					if (typeof response?.data === "string") {
						const trimmedData = response.data.trim();
						const errorText = trimmedData.length > 0 ? trimmedData : response.statusText;

						throw new Error(errorText);
					}

					throw new Error(errorMessage ?? "An unknown error occurred.");
				}

				throw error;
			});
	}

	async get<ResponseJSON>(config: Omit<AxiosOptions, "method">): Promise<ResponseJSON> {
		return this.customAxios<ResponseJSON>({
			...config,
			method: "GET"
		});
	}

	async post<ResponseJSON>(config: Omit<AxiosOptions, "method">): Promise<ResponseJSON> {
		return this.customAxios<ResponseJSON>({
			...config,
			method: "POST"
		});
	}

	async patch<ResponseJSON>(config: Omit<AxiosOptions, "method">): Promise<ResponseJSON> {
		return this.customAxios<ResponseJSON>({
			...config,
			method: "PATCH"
		});
	}

	async put<ResponseJSON>(config: Omit<AxiosOptions, "method">): Promise<ResponseJSON> {
		return this.customAxios<ResponseJSON>({
			...config,
			method: "PUT"
		});
	}

	async delete<ResponseJSON>(config: Omit<AxiosOptions, "method">): Promise<ResponseJSON> {
		return this.customAxios<ResponseJSON>({
			...config,
			method: "DELETE"
		});
	}
}

class HttpClient {
	private readonly ipv6_block: string[];
	axios: AxiosClient;

	constructor({ ipv6_block }: { ipv6_block: string[] }) {
		this.ipv6_block = ipv6_block;
		this.axios = new AxiosClient({ ipv6_block: this.ipv6_block });
	}

	readonly fetch: FetchClient = new FetchClient();
}

export default HttpClient;
