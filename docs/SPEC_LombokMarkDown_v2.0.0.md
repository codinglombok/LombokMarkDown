# LombokMarkDown — SPEC v2.0.0

This document is the normative cross-language contract. Every language port MUST produce byte-identical output for all specified inputs. Deviations from this specification are bugs.

| Atribut | Nilai |
|---|---|
| Versi SPEC | 2.0.0 (berlaku untuk paket `lombokmarkdown` 2.0.x) |
| Standar acuan | CommonMark Spec 0.31.2 (2024-01-28); GitHub Flavored Markdown Spec 0.29-gfm (2019-04-06) untuk ekstensi; WHATWG HTML Living Standard (tinjauan 2026-10-01) untuk escaping dan entitas bernama |
| Suite kesesuaian | 652 contoh CommonMark 0.31.2 (paket `commonmark-spec`) + 24 contoh ekstensi GFM 0.29 (`tests/fixtures`) |
| Vector | `vectors/lombokmarkdown-vectors-v1.json` — 114 kasus (html 79, ast 17, metadata 11, toc 7) — SHA-256 `c36d84c01bf4da3833bc742f61481e978ae8ca1bfa40b87e3750eb6809dddffc` |
| Referensi | TypeScript (`src/`) |
| Tanggal tinjauan | 2026-10-01 |

Kata MUST, MUST NOT, SHOULD, MAY mengikuti RFC 2119.

## 1. Kesesuaian

1. Dengan opsi `{ gfm: false, html: true, safeLinks: false }`, keluaran HTML MUST identik byte-demi-byte dengan kolom `html` setiap contoh CommonMark 0.31.2 (karakter `→` di spesifikasi berarti TAB).
2. Dengan opsi `{ gfm: true, html: true, safeLinks: false }`, keluaran MUST identik dengan setiap contoh ekstensi GFM 0.29 (table, strikethrough, autolink, tagfilter, tasklist).
3. Bagian berikut menetapkan perilaku di luar kedua spesifikasi itu: opsi, mode aman, batas, AST, metadata, dan daftar isi.

## 2. Opsi

| Opsi | Bawaan | Efek |
|---|---|---|
| `gfm` | `true` | tabel, strikethrough (`~`/`~~`), daftar tugas, autolink diperluas (`www.`, `http://`, `https://`, `ftp://`, email), tag filter |
| `html` | `false` | `false`: HTML mentah (blok dan inline) ditampilkan sebagai teks ter-escape; `true`: diteruskan apa adanya |
| `safeLinks` | `true` | URL tidak aman diganti string kosong (§3.2) di HTML, AST, dan metadata |
| `breaks` | `false` | soft line break dirender `<br />\n` |
| `headingIds` | `false` | atribut `id` pada heading (§5) |
| `pedantic`, `smartLists`, `smartypants` | — | usang sejak 2.0.0, MUST diabaikan |

## 3. HTML

### 3.1 HTML mentah saat `html: false`

- Blok HTML dirender `<p>` + `esc(literal)` + `</p>` lalu LF, dengan `literal` = isi blok tanpa LF terakhir.
- HTML inline dirender `esc(teks)`.
- `esc` mengganti `&`, `<`, `>`, `"` dengan `&amp;`, `&lt;`, `&gt;`, `&quot;` (sama dengan escaping teks CommonMark).

### 3.2 URL tidak aman

URL tidak aman bila diawali (tidak peka huruf besar) `javascript:`, `vbscript:`, `file:`, atau `data:`, kecuali diawali `data:image/png;`, `data:image/gif;`, `data:image/jpeg;`, atau `data:image/webp;`. Pemeriksaan dilakukan pada URL setelah normalisasi CommonMark (percent-encoding). Berlaku untuk tautan, gambar, autolink, dan autolink diperluas.

### 3.3 Tag filter GFM

Bila `gfm` dan `html` aktif, setiap `<` yang memulai (tidak peka huruf besar) `title`, `textarea`, `style`, `xmp`, `iframe`, `noembed`, `noframes`, `script`, atau `plaintext` (opsional didahului `/`, diikuti whitespace, `/`, `>`, atau akhir teks) di HTML mentah diganti `&lt;`.

### 3.4 Daftar tugas (GFM)

Item daftar yang isinya diawali `[ ]`, `[x]`, atau `[X]` diikuti spasi/TAB dan teks bukan-kosong menjadi item tugas. Penanda dibuang dari isi dan item dirender `<li><input disabled="" type="checkbox"> ` atau `<li><input checked="" disabled="" type="checkbox"> ` sebelum isi.

### 3.5 Batas implementasi

1. Kurung bersarang dalam tujuan tautan dibatasi 32 tingkat (CommonMark 0.31.2 §6.3 mengizinkan batas); melebihi batas berarti bukan tautan.
2. Implementasi MUST bekerja tanpa rekursi yang kedalamannya bergantung masukan, dan MUST berjalan dalam waktu mendekati linier pada masukan patologis (lihat `tests/pathological.test.ts`).
3. U+0000 diganti U+FFFD.

## 4. Metadata (`getMetadata`)

Dikumpulkan dalam urutan dokumen (penelusuran pre-order):

| Field | Isi |
|---|---|
| `headings` | `{ level, text }`; `text` = teks polos (§4.1) |
| `links` | `{ text, url, title? }` untuk tautan, autolink, dan autolink diperluas; `url` mengikuti `safeLinks` |
| `images` | `{ alt, src, title? }`; `alt` = teks polos isi gambar |
| `codeBlocks` | `{ lang?, code }`; `lang` = kata pertama info string; `code` = isi blok tanpa satu LF terakhir |

`title` hanya ditulis bila tidak kosong.

### 4.1 Teks polos

Gabungan nilai node `text` dan `code` dalam urutan dokumen; soft/hard break menjadi satu spasi; HTML inline mentah dihilangkan (juga ketika `html: false`), sama seperti yang dilakukan GitHub.

## 5. Slug heading dan daftar isi

1. Slug dasar = teks polos heading, huruf kecil (`toLowerCase` Unicode), dihapus semua karakter kecuali huruf (`\p{L}`), tanda (`\p{M}`), angka (`\p{N}`), penghubung (`\p{Pc}`), spasi, dan `-`; lalu setiap spasi menjadi `-`.
2. Slug unik per dokumen: bila slug dasar sudah dipakai, coba `<dasar>-1`, `<dasar>-2`, dan seterusnya (lanjut dari angka terakhir untuk dasar itu) sampai belum terpakai; setiap slug yang dihasilkan dicatat sebagai terpakai.
3. `headingIds: true` menulis ` id="<esc(slug)>"` pada tag pembuka heading.
4. `getTableOfContents()` memakai slug yang sama (urutan dokumen). Entri `{ level, text, id, children }`; entri menjadi anak dari entri terakhir yang levelnya lebih kecil, selain itu menjadi akar.

## 6. AST (`getAST`)

Mengembalikan anak-anak node akar. Pemetaan:

| Node | Field |
|---|---|
| `heading` | `depth`, `children` |
| `paragraph`, `blockquote`, `emphasis`, `strong`, `delete` | `children` |
| `list` | `ordered`, `loose` (kebalikan tight), `start` (hanya ordered), `children` |
| `listItem` | `checked` (hanya item tugas), `children` |
| `codeBlock` | `value` (dengan LF akhir), `lang` dan `meta` (info string penuh) bila ada |
| `html` | `value`; `inline: true` untuk HTML inline |
| `thematicBreak`, `softBreak`, `lineBreak` | — |
| `table` | `children` (baris) |
| `tableRow` | `header`, `children` |
| `tableCell` | `header`, `align` bila ada, `children` |
| `text` | `value` |
| `code` | `value`, `inline: true` |
| `link` | `href`, `title` bila ada, `children` |
| `image` | `href`, `alt` (teks polos), `title` bila ada |

Definisi referensi tautan tidak menghasilkan node. Dengan GFM, node teks yang bersebelahan digabung (efek pemrosesan autolink diperluas); tanpa GFM, pemecahan node teks mengikuti parser dan tidak normatif kecuali seperti tercatat di vector.

## 7. Keamanan (normatif)

1. Bawaan aman: `html: false` dan `safeLinks: true` sehingga masukan tak tepercaya tidak dapat menyisipkan elemen, atribut, atau skrip.
2. Semua teks dan nilai atribut di-escape; URL dinormalisasi dengan percent-encoding.
3. Tidak ada I/O, `eval`, atau regex dengan backtracking eksponensial; batas §3.5 mencegah kerja kuadratik dan stack overflow.
4. Dengan `html: true`, keluaran hanya aman bila disanitasi oleh pemanggil (misalnya LombokHTML); tag filter GFM bukan sanitizer.

## 8. Perubahan dari 1.0.0

Parser ditulis ulang agar patuh CommonMark 0.31.2 + GFM. Perubahan keluaran yang tampak: blok dipisah LF, `<ol start="1">` menjadi `<ol>`, isi blok kode tidak di-trim, HTML mentah di-escape secara bawaan, URL tidak aman dikosongkan. Kelas `Tokenizer`, `Parser`, `HTMLCompiler` dihapus. Rincian di `UPGRADE.md`.

*Lisensi dokumen: Apache-2.0 · © codinglombok*
