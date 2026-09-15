# LombokMarkDown

> Zero-dependency Markdown → HTML converter with GFM, metadata extraction, and TOC generation.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/lombokmarkdown.svg?logo=npm)](https://www.npmjs.com/package/lombokmarkdown)
[![npm downloads](https://img.shields.io/npm/dm/lombokmarkdown.svg)](https://www.npmjs.com/package/lombokmarkdown)
[![PyPI](https://img.shields.io/pypi/v/lombokmarkdown.svg?logo=pypi)](https://pypi.org/project/lombokmarkdown)
[![Packagist](https://img.shields.io/packagist/v/codinglombok/lombokmarkdown.svg?logo=packagist)](https://packagist.org/packages/codinglombok/lombokmarkdown)
[![CI](https://github.com/codinglombok/LombokMarkDown/actions/workflows/ci.yml/badge.svg)](https://github.com/codinglombok/LombokMarkDown/actions/workflows/ci.yml)
[![jsDelivr](https://img.shields.io/jsdelivr/npm/hm/lombokmarkdown.svg)](https://www.jsdelivr.com/package/npm/lombokmarkdown)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)](tsconfig.json)
[![Lombok Ecosystem](https://img.shields.io/badge/Lombok-Ecosystem-2e7d5b?logo=github)](https://github.com/codinglombok)

---

Lightweight, zero-dependency Markdown to HTML converter with GitHub Flavored Markdown (GFM) support.

## Features
**Fast & Lightweight**
- Zero runtime dependencies
- Pure TypeScript implementation
- ~10KB minified
**Complete Markdown Support**
- Headings (h1-h6)
- Paragraphs
- Bold, italic, inline code
- Code blocks with syntax highlighting
- Lists (ordered & unordered)
- Blockquotes
- Horizontal rules
- Links and images
- Metadata extraction
**Metadata Extraction**
- Extract all headings with levels
- Extract all links
- Extract all images
- Extract all code blocks
- Generate table of contents
**Multi-Language**
- JavaScript/TypeScript (this package)
- Python (coming soon)
- PHP (coming soon)
- Go (coming soon)
**Apache 2.0 License**
- Commercial friendly
- Attribution required

## Installation

```bash
npm install lombokmarkdown
```

## Quick Start

```typescript
import { Markdown } from 'lombokmarkdown'

const md = new Markdown(`
# Hello World

This is **bold** and *italic* text.

- Item 1
- Item 2

[Visit Example](https://example.com)
`)

// Get HTML
const html = md.parse().getHTML()

// Get metadata
const meta = md.getMetadata()
console.log(meta.headings)    // [{ level: 1, text: 'Hello World' }]
console.log(meta.links)       // [{ text: 'Visit Example', url: 'https://example.com' }]

// Get table of contents
const toc = md.getTableOfContents()

// Get specific content
console.log(md.getHeadings())
console.log(md.getImages())
console.log(md.getCodeBlocks())
```

## API Reference

### `new Markdown(text, options?)`

Create a new Markdown parser.
**Parameters:**
- `text` (string): Markdown text to parse
- `options` (MarkdownOptions, optional):
  - `gfm` (boolean): Enable GitHub Flavored Markdown (default: true)
  - `breaks` (boolean): Convert `\n` to `<br>` (default: false)
**Example:**
```typescript
const md = new Markdown('# Title', { gfm: true })
```

### `parse(): this`

Parse the markdown and return self for chaining.

```typescript
const html = new Markdown(text).parse().getHTML()
```

### `getHTML(): string`

Get the HTML output.

```typescript
const html = md.parse().getHTML()
// Returns: "<h1>Hello</h1><p>World</p>"
```

### `getAST(): ASTNode[]`

Get the Abstract Syntax Tree.

```typescript
const ast = md.getAST()
// [
//   { type: 'heading', depth: 1, children: [...] },
//   { type: 'paragraph', children: [...] }
// ]
```

### `getMetadata(): MarkdownMetadata`

Get extracted metadata.

```typescript
const meta = md.getMetadata()
// {
//   headings: [...],
//   links: [...],
//   images: [...],
//   codeBlocks: [...]
// }
```

### `getTableOfContents(): TOCEntry[]`

Generate table of contents from headings.

```typescript
const toc = md.getTableOfContents()
// [
//   {
//     level: 1,
//     text: 'Main Title',
//     id: 'main-title',
//     children: [...]
//   }
// ]
```

### Shortcut Methods

```typescript
md.getHeadings()      // Array<{ level, text }>
md.getLinks()         // Array<{ text, url, title? }>
md.getImages()        // Array<{ alt, src, title? }>
md.getCodeBlocks()    // Array<{ lang?, code }>
```

### `toJSON()`

Export everything as JSON.

```typescript
const json = md.toJSON()
// { ast, metadata, html }
```

## Examples

### Simple Conversion

```typescript
const md = new Markdown('# Hello\n\nWorld')
console.log(md.parse().getHTML())
// Output: <h1>Hello</h1><p>World</p>
```

### Extract Links from Document

```typescript
const md = new Markdown(document)
md.parse()
const links = md.getLinks()
links.forEach(link => {
  console.log(`[${link.text}](${link.url})`)
})
```

### Generate Table of Contents

```typescript
const md = new Markdown(document)
md.parse()
const toc = md.getTableOfContents()
renderTOC(toc)
```

### Extract Code Examples

```typescript
const md = new Markdown(document)
md.parse()
const codeBlocks = md.getCodeBlocks()
codeBlocks.forEach(block => {
  if (block.lang === 'javascript') {
    executeCode(block.code)
  }
})
```

### Build Search Index

```typescript
const md = new Markdown(document)
md.parse()
const meta = md.getMetadata()

// Index headings
meta.headings.forEach(h => {
  index.add({ type: 'heading', text: h.text, level: h.level })
})

// Index links
meta.links.forEach(link => {
  index.add({ type: 'link', text: link.text, url: link.url })
})
```

## Supported Markdown

### Block Elements
- Headings: `# H1` through `###### H6`
- Paragraphs: Text separated by blank lines
- Code blocks: ` ```language \n code \n ``` `
- Blockquotes: `> quote`
- Lists: `- item` or `1. item`
- Horizontal rules: `---`, `***`, or `___`

### Inline Elements
- Bold: `**text**` or `__text__`
- Italic: `*text*` or `_text_`
- Inline code: `` `code` ``
- Links: `[text](url)`
- Images: `![alt](src)`

### GFM Extensions (v1.0.0)
- Tables
- Strikethrough: `~~text~~`
- Autolinks: `https://example.com`
- Task lists: `- [ ] task`
- Footnotes

## Performance

- Parsing 1000 documents: < 100ms
- Typical document (10KB): < 1ms
- Memory efficient: streaming tokenizer

See `benchmarks/` for detailed results.

## Testing

```bash
npm run test              # Run all tests
npm run test:cov          # Generate coverage report
npm run dev               # Watch mode
```

Test coverage: 90%+ statements, branches, functions, lines

## Browser Support

- Node.js 18+
- Deno
- Browser: ESM builds work in all modern browsers

```html
<script type="module">
  import { Markdown } from 'https://cdn.jsdelivr.net/npm/lombokmarkdown'
  const md = new Markdown('# Hello')
  document.body.innerHTML = md.parse().getHTML()
</script>
```

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

Apache License 2.0 - See [LICENSE](LICENSE)

## Changelog

See [CHANGELOG.md](CHANGELOG.md)

## See Also

- [LombokDocx](https://github.com/codinglombok/LombokDocx) - DOCX extraction
- [LombokCSV](https://github.com/codinglombok/LombokCSV) - CSV to HTML
- [LombokPDF](https://github.com/codinglombok/lombokpdf) - PDF generation



## Lombok Ecosystem

This library is part of the **[Lombok Ecosystem](https://github.com/codinglombok)** — a modular suite of production-grade, Apache-2.0 libraries for document processing, PDF generation, and data visualization. Built for **developers, researchers, students, and the wider community**.

[![Ecosystem](https://img.shields.io/badge/Lombok-Ecosystem-2e7d5b?logo=github)](https://github.com/codinglombok)
[![Roadmap](https://img.shields.io/badge/Project-Roadmap-8b5cf6?logo=github)](https://github.com/orgs/codinglombok/projects)

| Layer | Library | Purpose |
|-------|---------|---------|
| **Core** | [LombokPDF](https://github.com/codinglombok/LombokPDF) | PDF generation hub |
| **Core** | [LombokCSS](https://github.com/codinglombok/LombokCSS) | Token-first CSS framework |
| **Core** | [LombokFuzzer](https://github.com/codinglombok/LombokFuzzer) | Fuzzing test framework |
| **Core** | [LombokCharts](https://github.com/codinglombok/LombokCharts) | Zero-dependency charts |
| **Docs** | [LombokDocFlow](https://github.com/codinglombok/LombokDocFlow) | Universal import/export |
| **Convert** | [LombokMarkDown](https://github.com/codinglombok/LombokMarkDown) | Markdown → HTML |
| **Convert** | [LombokDocx](https://github.com/codinglombok/LombokDocx) | DOCX → HTML |
| **Convert** | [LombokCSV](https://github.com/codinglombok/LombokCSV) | CSV → HTML tables |
| **Meta** | [LombokJpegExif](https://github.com/codinglombok/LombokJpegExif) | JPEG EXIF metadata |

> **New to the ecosystem?** Start at the [ecosystem overview](https://github.com/codinglombok) or the [DocFlow demo](https://github.com/codinglombok/LombokDocFlow).

