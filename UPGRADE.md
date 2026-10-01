# Upgrading LombokMarkDown

## 1.x to 2.0.0

2.0.0 replaces the hand-written parser with one that follows CommonMark 0.31.2 and the GFM
extensions. Most documents render the same content, but the exact HTML string changes.

| Area | 1.x | 2.0.0 | What to do |
|---|---|---|---|
| Block separation | blocks concatenated with no newline | each block ends with `\n` | compare HTML after trimming, or update snapshots |
| Ordered lists | `<ol start="1">` | `<ol>` (start written only when not 1) | update snapshots |
| Code blocks | content trimmed | content kept as written, with a final `\n` | update snapshots |
| Raw HTML | always escaped as text | escaped by default; HTML blocks are wrapped in `<p>` | pass `{ html: true }` to render HTML in trusted documents |
| Unsafe links | `javascript:` URLs kept | emptied by default | pass `{ safeLinks: false }` only for trusted documents |
| Exports | `Tokenizer`, `Parser`, `HTMLCompiler`, `Token`, `HTMLOptions` | removed | use `Markdown` / `markdownToHTML`; the AST is available from `getAST()` |
| Options | `pedantic`, `smartLists`, `smartypants` | ignored | remove them |
| TOC ids | lower-case ASCII only (`\w`), no duplicate handling | GitHub slugs: Unicode letters kept, duplicates get `-1`, `-2` | links to old ids with non-ASCII text change |
| Metadata `codeBlocks[].code` | trimmed | final newline removed, other whitespace kept | none in most cases |

New in 2.0.0: GFM tables, strikethrough, task lists, extended autolinks, `headingIds`, `breaks`, `markdownToHTML()`, and `Slugger`.
