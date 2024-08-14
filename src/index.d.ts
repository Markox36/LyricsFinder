// Importaciones necesarias
import { type HttpClient } from "./HttpClient";

export interface LyricsFinderOptions {
	ipv6_blocklist?: string[];
}

export class LyricsFinderType {
	private readonly httpClient: HttpClient;

	constructor(options: LyricsFinderOptions);

	findLyrics(song: string): Promise<string>;
}

export default LyricsFinder;
