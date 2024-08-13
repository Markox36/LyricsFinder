import { parse } from "node-html-parser";
import HttpClient from "./HttpClient";

interface LyricsFinderOptions {
	ipv6_blocklist?: string[];
}

class LyricsFinder {
	private readonly httpClient: HttpClient;

	constructor({ ipv6_blocklist }: LyricsFinderOptions) {
		this.httpClient = new HttpClient({ ipv6_block: ipv6_blocklist || [] });
	}

	async findLyrics(song: string): Promise<string> {
		const params = new URLSearchParams({
			q: `${song} lyrics`
		});

		const res = await this.httpClient.axios.get<string>({
			url: `https://www.bing.com/search?${params}`
		});
		const root = parse(res);

		return root.querySelector(".lyrics")?.text ?? "No lyrics found";
	}
}

export { LyricsFinder };
export default LyricsFinder;
