import { LyricsFinder } from "./LyricsFinder";

const lyricsFinder = new LyricsFinder({ ipv6_blocklist: [] });

lyricsFinder
	.findLyricsByScraping("Despacito luis fonsi")
	.then(console.log)
	.catch((err: unknown) => console.log(err));
