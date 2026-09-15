# Changelog

All notable changes to **LombokMarkDown** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Python port (`lombokmarkdown` on PyPI)
- PHP port (`codinglombok/markdown` on Packagist)
- Go port
- Performance benchmarks published to `benchmarks/`

---

## [1.0.0] — 2026-08-24

First **stable** release. API is now considered stable under SemVer.

### Added
- **GitHub Flavored Markdown (GFM)**: tables, strikethrough, task lists, autolinks, footnotes
- Custom renderer hooks for extensibility
- Streaming tokenizer for large documents
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

[Unreleased]: https://github.com/codinglombok/LombokMarkDown/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/codinglombok/LombokMarkDown/releases/tag/v1.0.0
[0.9.0-alpha]: https://github.com/codinglombok/LombokMarkDown/releases/tag/v0.9.0-alpha
