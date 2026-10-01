# Changelog

All notable changes to **LombokMarkDown** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [2.0.0] — 2026-10-01

New parser that follows the CommonMark 0.31.2 specification and the GitHub Flavored
Markdown 0.29 extensions, with safe defaults. Aligns the library with the Lombok
Ecosystem v3.6 standards. Migration notes: `UPGRADE.md`.

### Added
- CommonMark 0.31.2 block and inline parsing: all 652 spec examples pass (`tests/spec.test.ts`).
- GFM tables, strikethrough, task list items, extended autolinks, and tag filter: all 24 GFM 0.29 extension examples pass.
- Options `html` (default `false`), `safeLinks` (default `true`), `headingIds`, and a working `breaks`.
- GitHub-style heading slugs shared by `headingIds` and `getTableOfContents()`; exported `Slugger`.
- `markdownToHTML()` shortcut; AST fields `checked`, `meta`, `header`, `align`.
- `docs/SPEC_LombokMarkDown_v2.0.0.md`, 114 vectors, 22 pathological-input tests, ten standard documents, `scripts/lombok-doctor.sh`, `NOTICE`.

### Changed (breaking)
- HTML follows the CommonMark reference format: blocks end with a line feed, `<ol start="1">` is written as `<ol>`, code block content keeps its whitespace and final newline.
- Raw HTML is escaped unless `html: true`; unsafe URL schemes are emptied unless `safeLinks: false`.
- `Tokenizer`, `Parser`, `HTMLCompiler`, and the `Token` / `HTMLOptions` types are removed.
- `pedantic`, `smartLists`, and `smartypants` are accepted but ignored.

### Fixed
- Security: `[x](javascript:...)` produced a clickable `javascript:` link (now emptied by default).
- A single unmatched `*`, `_`, or backtick consumed the rest of the paragraph.
- Nested lists, lazy continuation lines, setext headings, reference links, entities, and backslash escapes were not supported.
- `getMetadata()` re-parsed the document whenever any metadata list was empty.

### Corrected claims
- The 1.0.0 entry listed footnotes, custom renderer hooks, a streaming tokenizer, and CDN distribution; the README advertised syntax highlighting and GFM tables. None of these were implemented in 1.0.0. In 2.0.0 GFM tables exist; footnotes, hooks, streaming, and syntax highlighting do not (see the known limitations in `docs/full_summary_project_LombokMarkDown_v2.0.0.md`).

## [1.0.0] — 2026-08-24

First **stable** release. API is now considered stable under SemVer.

### Added
- **GitHub Flavored Markdown (GFM)**: tables, strikethrough, task lists, autolinks, footnotes — not implemented (corrected in 2.0.0)
- Custom renderer hooks for extensibility — not implemented (corrected in 2.0.0)
- Streaming tokenizer for large documents — not implemented (corrected in 2.0.0)
- `toJSON()` combined export (ast + metadata + html)
- CDN distribution via jsDelivr
- 90%+ test coverage across statements, branches, functions, lines

### Changed
- Promoted from alpha to stable; public API frozen
- Full CI matrix (Node 18 / 20 / 22)
- GitHub Pages documentation site
- npm provenance publishing

### Fixed
- Edge cases in nested structures surfaced during alpha testing

---

## [0.9.0-alpha] — 2026-07-24

Initial alpha release.

### Added
- Markdown → HTML conversion with zero dependencies
- All standard block & inline elements (headings, lists, code, quotes, links, images, rules)
- Metadata extraction (headings, links, images, code blocks)
- Table of contents generation with slug IDs
- Abstract Syntax Tree (AST) access
- HTML escaping / XSS prevention
- ESM + CommonJS builds; 40+ tests

### Known limitations (resolved in 1.0.0)
- Alpha API subject to change
- Multi-language ports not yet available

---

[Unreleased]: https://github.com/codinglombok/LombokMarkDown/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/codinglombok/LombokMarkDown/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/codinglombok/LombokMarkDown/releases/tag/v1.0.0
[0.9.0-alpha]: https://github.com/codinglombok/LombokMarkDown/releases/tag/v0.9.0-alpha
