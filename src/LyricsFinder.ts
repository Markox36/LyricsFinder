import { parse } from "node-html-parser";
import HttpClient from "./HttpClient";
import puppeter from "puppeteer";
import { type LyricsFinderOptions } from ".";

class LyricsFinder {
	private readonly httpClient: HttpClient;

	constructor({ ipv6_blocklist }: LyricsFinderOptions) {
		this.httpClient = new HttpClient({ ipv6_block: ipv6_blocklist || [] });
	}
	// This method is temporaly deprecated

	async findLyrics(song: string): Promise<string> {
		const res = await this.httpClient.axios.get<string>({
			url: `https://duckduckgo.com`,
			params: {
				q: `${song} lyrics`
			}
		});
		const root = parse(res);
		console.log(root.outerHTML);

		return root.querySelector(".lyrics")?.text ?? "No lyrics found";
	}

	async findLyricsByScraping(song: string): Promise<string> {
		const browser = await puppeter.launch({ headless: true });
		const page = await browser.newPage();
		await page.goto(`https://bing.com/?q=${song} lyrics`);
		await page.waitForSelector("div.lyrics");
		const lyrics = await page.$$eval(".verse", (el) =>
			el
				.map((e) => e.innerHTML)
				.join("")
				.replace(/<br>/g, "\n")
		);
		await browser.close();
		return lyrics || "No lyrics found";
	}
}

export { LyricsFinder };
export default LyricsFinder;
