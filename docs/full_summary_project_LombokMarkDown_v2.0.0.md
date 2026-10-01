# LombokMarkDown — Full Summary Project v2.0.0

| Item | Nilai |
|---|---|
| Deskripsi | Markdown ke HTML patuh CommonMark 0.31.2 + GFM 0.29, bawaan aman, AST, metadata, id heading dan daftar isi; tanpa dependensi |
| Cluster · tingkat | 03.07 · L0 |
| Referensi | TypeScript, sekitar 2 100 baris di `src/` (termasuk tabel entitas) |
| Port | Python, Go, PHP: stub |
| Kesesuaian | CommonMark 0.31.2: 652/652 · GFM 0.29 ekstensi: 24/24 |
| Vector | 114 kasus · SHA-256 `c36d84c0...dddffc` |
| Test | 847 (652 + 24 spesifikasi, 115 vector, 22 patologis, 34 unit) · coverage baris 99,6%, cabang 96,6% |
| Uji mutasi | 11 mutan pada mode aman, opsi, slug, TOC, metadata: semua terbunuh oleh vector + unit (tanpa suite spesifikasi) |
| Fuzz | lombokfuzzer, 30 000 eksekusi lokal tanpa crash/hang |
| Registry | npm `lombokmarkdown` (belum terbit) |
| Lisensi | Apache-2.0; data entitas BSD-2-Clause (NOTICE) |

## 1. Tabel gap vs pembanding (jujur)

| Kemampuan | LombokMarkDown 2.0.0 | markdown-it | micromark | commonmark.js | marked |
|---|---|---|---|---|---|
| CommonMark 0.31.2 penuh | YA | YA | YA | YA | sebagian |
| GFM tabel, strikethrough, tugas, autolink | YA | plugin | ekstensi | TIDAK | YA |
| Catatan kaki GFM | TIDAK | plugin | ekstensi | TIDAK | TIDAK |
| Aman secara bawaan (HTML mentah + skema URL) | YA | sebagian (html: false) | YA | opsi safe | TIDAK |
| Metadata + daftar isi + slug GitHub bawaan | YA | plugin | TIDAK | TIDAK | TIDAK |
| AST publik | YA (sederhana) | token | mdast via ekstensi | YA | token |
| Plugin/ekstensi sintaks | TIDAK | YA | YA | TIDAK | YA |
| Dependensi runtime | 0 | 6 | 3+ | 3 | 0 |
| Kontrak lintas bahasa (SPEC + vector) | YA | TIDAK | TIDAK | TIDAK | TIDAK |

## 2. Batasan yang Diketahui

1. Hanya port TypeScript yang ada.
2. Catatan kaki GFM, math, front matter, dan definition list tidak didukung.
3. Tidak ada sistem plugin atau hook renderer. Klaim "custom renderer hooks", "streaming tokenizer", dan "footnotes" di CHANGELOG 1.0.0 tidak pernah diimplementasikan.
4. Dengan `html: true`, keluaran bukan sanitasi lengkap; pasangkan dengan sanitizer bila masukan tak tepercaya.
5. Autolink diperluas diterapkan pada node teks setelah parsing; kasus tepi GFM yang bergantung pada karakter sebelum autolink di luar node teks dapat berbeda dari cmark-gfm.
6. Tag filter GFM bekerja pada teks HTML mentah, bukan pada DOM.
7. Pemecahan node teks di AST tanpa GFM tidak normatif (SPEC §6).

## 3. Prinsip Universal (ringkas, untuk publik)

| Prinsip | Status | Bukti |
|---|---|---|
| U1 Mandiri | YA | README bebas klaim; skenario netral di guide_ §6 |
| U2 Modern | YA | CommonMark 0.31.2 (rilis terbaru), GFM 0.29, entitas WHATWG |
| U3 Multi-platform | SEBAGIAN | TS murni; CI 3 OS; belum WASM/`no_std` |
| U4 Multi-bahasa | SEBAGIAN | hanya runner TS; port lain stub |
| U5 Rentang skala | YA | 0 dependensi; masukan patologis 20 000 pengulangan < 1 s |
| U6 Lengkap & unik | SEBAGIAN | catatan kaki dan plugin belum ada |
| U7 Aman & teruji | YA | SPEC §7, 847 test, fuzz, uji mutasi |
| U8 Ekosistem tanpa kopling | YA | 0 dependensi wajib |
| U9 Internasional | YA | Unicode penuh untuk emphasis, label, slug; entitas WHATWG |
| U10 Lisensi | YA | Apache-2.0 + NOTICE |
| U11 Siap registri | YA | `npm pack` di CI, gate tag |
| U12 Dokumentasi | YA | 10 publik + 2 internal |
| U13 Kerahasiaan & dokumen bersih | YA | doctor |

*Lisensi dokumen: Apache-2.0 · © codinglombok*
