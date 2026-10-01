# LombokMarkDown — Guide How to Use v2.0.0

## 1. Pemasangan

```bash
npm install lombokmarkdown
```

Belum terbit di npm saat dokumen ini ditulis; sementara: `npm install github:codinglombok/LombokMarkDown`.

## 2. Konversi dasar

```ts
import { markdownToHTML } from 'lombokmarkdown'
markdownToHTML('**Halo** dunia')   // '<p><strong>Halo</strong> dunia</p>\n'
```

## 3. Masukan dari pengguna (komentar, forum, catatan)

Bawaan sudah aman: HTML mentah ditampilkan sebagai teks dan URL `javascript:` dikosongkan.

```ts
markdownToHTML('<img src=x onerror=alert(1)> [klik](javascript:alert(1))')
// '<p>&lt;img src=x onerror=alert(1)&gt; <a href="">klik</a></p>\n'
```

## 4. Dokumen tepercaya (dokumentasi, blog statis)

```ts
import { Markdown } from 'lombokmarkdown'
const md = new Markdown(source, { html: true, headingIds: true })
const html = md.getHTML()
const toc = md.getTableOfContents()   // untuk sidebar navigasi
```

## 5. Analisis isi

```ts
const meta = new Markdown(source).getMetadata()
meta.links.filter(l => l.url.startsWith('http'))  // pemeriksaan tautan rusak
meta.codeBlocks.map(c => c.lang)                    // bahasa contoh kode
```

## 6. Skenario pemakaian

| Skenario | Contoh |
|---|---|
| Kolom komentar dan forum | render masukan pengguna tanpa XSS |
| Generator situs statis dan dokumentasi | HTML + daftar isi + id heading |
| README dan catatan rilis | rendering setara GitHub (GFM) |
| Pemeriksa konten | daftar tautan, gambar, blok kode untuk validasi |
| Aplikasi catatan di perangkat seluler/desktop | TS murni, tanpa dependensi |

## 7. Batasan

Lihat [full_summary_](full_summary_project_LombokMarkDown_v2.0.0.md) bagian "Batasan yang Diketahui".

*Lisensi dokumen: Apache-2.0 · © codinglombok*
