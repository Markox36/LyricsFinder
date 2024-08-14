# lyrics-finder-ipv6

**lyrics-finder-ipv6** is an npm package for searching song lyrics with support for IPv6 address rotation.

## Installation

You can install **lyrics-finder-ipv6** via npm using the following command:

```bash
npm install lyrics-finder-ipv6
```

## Usage

To use **lyrics-finder-ipv6**, you first need to import it and then create an instance of `lyrics-finder-ipv6`. You can then use the `findLyrics` method to search for song lyrics. Here is a basic example:

### Example without IPv6 block

```typescript
import { LyricsFinder } from 'lyrics-finder-ipv6';

// Create an instance of LyricsFinder with an empty IPv6 blocklist.
const lyricsFinder = new LyricsFinder({ ipv6_blocklist: [] });

// Search for lyrics for the specified song.
lyricsFinder
  .findLyrics(\"Despacito - Luis Fonsi\")
  .then(console.log)
  .catch((err: unknown) => console.log(err));
```

## Methods

### `findLyrics(query: string): Promise<string>`

- **query**: The search query specifying the song and artist.
- **Returns**: A promise that resolves with the song lyrics in string format.

## Configuration

You can configure the behavior of `lyrics-finder-ipv6` by passing options to the constructor. Currently, you can specify an IPv6 blocklist:

```typescript
const lyricsFinder = new LyricsFinder({ ipv6_blocklist: [\"::1\"] });
```

## Contributing

If you want to contribute to **lyrics-finder-ipv6**, please follow these steps:

1. Fork the repository.
2. Create a branch for your changes (`git checkout -b feature/new-feature`).
3. Make your changes and commit (`git commit -am 'Add new feature'`).
4. Push your changes to your repository (`git push origin feature/new-feature`).
5. Create a pull request on GitHub.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contact

For more information, you can contact the author at [hello@markox.dev](mailto:hello@markox.dev) or visit the [GitHub repository](https://github.com/Markox36/LyricsFinder).

---

Thank you for using **lyrics-finder-ipv6**! If you have any questions or need help, feel free to open an issue on the GitHub repository.
