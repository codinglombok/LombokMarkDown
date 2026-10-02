# LombokMarkDown — API v2.0.0

Referensi API publik paket npm `lombokmarkdown` 2.0.0. Perilaku normatif: [SPEC_](SPEC_LombokMarkDown_v2.0.0.md).

## 1. Ekspor

| Ekspor | Jenis | Ringkas |
|---|---|---|
| `Markdown` | kelas | parse sekali, lalu HTML, AST, metadata, daftar isi |
| `markdownToHTML(input, options?)` | fungsi | jalan pintas `new Markdown(input, options).getHTML()` |
| `Slugger` | kelas | slug heading gaya GitHub (`slug(text)`) yang unik per instance |
| `MarkdownOptions`, `ASTNode`, `MarkdownMetadata`, `TOCEntry` | tipe | lihat §3 |

## 2. Kelas `Markdown`

| Anggota | Hasil | Catatan |
|---|---|---|
| `new Markdown(input: string, options?: MarkdownOptions)` | — | tidak melempar error untuk masukan apa pun |
| `parse()` | `this` | opsional; dipanggil otomatis, hanya sekali |
| `getHTML()` | `string` | fragmen HTML, diakhiri LF bila tidak kosong |
| `getAST()` | `ASTNode[]` | anak-anak root (SPEC §6) |
| `getMetadata()` | `MarkdownMetadata` | heading, tautan, gambar, blok kode (SPEC §4) |
| `getHeadings()`, `getLinks()`, `getImages()`, `getCodeBlocks()` | array | bagian dari metadata |
| `getTableOfContents()` | `TOCEntry[]` | bersarang; `id` sama dengan `headingIds: true` |
| `toJSON()` | `{ ast, metadata, html }` | |

## 3. Opsi

```ts
interface MarkdownOptions {
  gfm?: boolean        // bawaan true: tabel, ~~hapus~~, - [ ] tugas, autolink www./https://, tag filter
  html?: boolean       // bawaan false: HTML mentah ditampilkan sebagai teks
  safeLinks?: boolean  // bawaan true: javascript:/vbscript:/file:/data: non-gambar dikosongkan
  breaks?: boolean     // bawaan false: soft break menjadi <br />
  headingIds?: boolean // bawaan false: id="slug" pada heading
  pedantic?, smartLists?, smartypants?  // usang, diabaikan
}
```

## 4. Contoh

```ts
import { Markdown } from 'lombokmarkdown'

const md = new Markdown('# Panduan\n\n## Instalasi\n\n[Unduh](https://example.com)', { headingIds: true })
md.getHTML()            // '<h1 id="panduan">Panduan</h1>\n<h2 id="instalasi">Instalasi</h2>\n<p><a href="https://example.com">Unduh</a></p>\n'
md.getTableOfContents() // [{ level: 1, text: 'Panduan', id: 'panduan', children: [{ level: 2, text: 'Instalasi', id: 'instalasi', children: [] }] }]
md.getLinks()           // [{ text: 'Unduh', url: 'https://example.com' }]
```

## 5. Perubahan dari 1.0.0

`Tokenizer`, `Parser`, `HTMLCompiler`, tipe `Token` dan `HTMLOptions` dihapus. Format HTML mengikuti CommonMark. Lihat `UPGRADE.md`.

*Lisensi dokumen: Apache-2.0 · © codinglombok*
