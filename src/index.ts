import { LyricsFinder } from "./LyricsFinder";

const lyricsFinder = new LyricsFinder({ ipv6_blocklist: [] });

lyricsFinder
	.findLyrics("Despacito - Luis Fonsi")
	.then(console.log)
	.catch((err: unknown) => console.log(err));
