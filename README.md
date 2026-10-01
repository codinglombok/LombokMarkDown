# LombokMarkDown

> CommonMark 0.31.2 and GitHub Flavored Markdown to HTML with safe defaults, an AST, metadata, heading ids, and a table of contents. Zero dependencies.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![CI](https://github.com/codinglombok/LombokMarkDown/actions/workflows/ci.yml/badge.svg)](https://github.com/codinglombok/LombokMarkDown/actions/workflows/ci.yml)
[![CommonMark](https://img.shields.io/badge/CommonMark-0.31.2%20652%2F652-success)](tests/spec.test.ts)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)](tsconfig.json)
[![Lombok Ecosystem](https://img.shields.io/badge/Lombok-Ecosystem-2e7d5b?logo=github)](https://github.com/codinglombok)

Part of the [Lombok Ecosystem](https://github.com/codinglombok).

## Mengapa library ini? (Why this library?)

- **Standard output.** Passes all 652 examples of the CommonMark 0.31.2 spec and all 24 GFM 0.29 extension examples (tables, strikethrough, task lists, extended autolinks, tag filter), checked on every CI run.
- **Safe by default.** Raw HTML is shown as text and `javascript:`, `vbscript:`, `file:`, and non-image `data:` URLs are emptied, so user-written Markdown cannot inject markup. Both can be relaxed for trusted documents.
- **More than HTML.** The same parse gives you a simple AST, headings, links, images, code blocks, GitHub-style heading ids, and a nested table of contents.
- **Robust.** No recursion that depends on the input and no quadratic paths: 22 adversarial patterns of 20 000 repetitions each finish in well under a second. Zero runtime dependencies; runs in Node.js, Deno, Bun, browsers, and edge runtimes.

## Installation

```bash
npm install lombokmarkdown
```

Not yet published to npm; until then install from GitHub with `npm install github:codinglombok/LombokMarkDown`.

## Quick start

```ts
import { Markdown, markdownToHTML } from 'lombokmarkdown'

markdownToHTML('**Hello** world')
// '<p><strong>Hello</strong> world</p>\n'

const md = new Markdown('# Guide\n\n## Install\n\n[Download](https://example.com)', { headingIds: true })
md.getHTML()
// '<h1 id="guide">Guide</h1>\n<h2 id="install">Install</h2>\n<p><a href="https://example.com">Download</a></p>\n'
md.getTableOfContents()
// [{ level: 1, text: 'Guide', id: 'guide', children: [{ level: 2, text: 'Install', id: 'install', children: [] }] }]
md.getLinks()
// [{ text: 'Download', url: 'https://example.com' }]
```

User input is safe without extra options:

```ts
markdownToHTML('<img src=x onerror=alert(1)> [click](javascript:alert(1))')
// '<p>&lt;img src=x onerror=alert(1)&gt; <a href="">click</a></p>\n'
```

## Options

| Option | Default | Effect |
|---|---|---|
| `gfm` | `true` | tables, `~~strikethrough~~`, `- [ ]` task lists, `www.` / `https://` / email autolinks, GFM tag filter |
| `html` | `false` | pass raw HTML through instead of escaping it |
| `safeLinks` | `true` | empty unsafe URL schemes |
| `breaks` | `false` | render soft line breaks as `<br />` |
| `headingIds` | `false` | add GitHub-style `id` attributes to headings |

API: `getHTML()`, `getAST()`, `getMetadata()`, `getHeadings()`, `getLinks()`, `getImages()`, `getCodeBlocks()`, `getTableOfContents()`, `toJSON()`, plus `markdownToHTML()` and `Slugger`. Full reference: [docs/API_LombokMarkDown_v2.0.0.md](docs/API_LombokMarkDown_v2.0.0.md).

## Upgrading from 1.x

2.0.0 replaces the parser. HTML now follows the CommonMark reference format, raw HTML is escaped by default, and the `Tokenizer`, `Parser`, and `HTMLCompiler` exports are gone. See [UPGRADE.md](UPGRADE.md).

## Known limitations

No GFM footnotes, front matter, math, or plugin system; with `html: true` the output still needs a sanitizer for untrusted input. See [Known limitations](docs/full_summary_project_LombokMarkDown_v2.0.0.md#2-batasan-yang-diketahui).

## Language ports

| Language | Status |
|---|---|
| TypeScript / JavaScript | Reference implementation: CommonMark 652/652, GFM 24/24, 114 project vectors |
| Python, Go, PHP | Planned (stub README only, no code yet) |

## Security

Guarantees are normative in [SPEC section 7](docs/SPEC_LombokMarkDown_v2.0.0.md#7-keamanan-normatif). Report vulnerabilities as described in [SECURITY.md](SECURITY.md).

## Development

```bash
npm ci
npm run check   # lint, tests with coverage (spec suites included), build, standards check
npm run fuzz
```

## Related libraries

- [LombokHTML](https://github.com/codinglombok/LombokHTML) — HTML parsing and sanitising
- [LombokDocx](https://github.com/codinglombok/LombokDocx) — read and write `.docx`
- [LombokCSV](https://github.com/codinglombok/LombokCSV) — CSV parsing and HTML tables

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE) (HTML entity data, BSD-2-Clause).
