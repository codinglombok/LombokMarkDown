# LombokMarkDown — Bahasa & i18n v2.0.0

| Atribut | Nilai |
|---|---|
| Tingkat i18n (masterplan §13) | **E** — dokumentasi saja; library tidak pernah melempar error |
| Katalog pesan | tidak diperlukan (tidak ada pesan ke pengguna) |
| Cakupan katalog saat ini | tidak berlaku |

## 1. Unicode

1. Teks dalam aksara apa pun dipertahankan tanpa normalisasi.
2. Aturan emphasis memakai kategori Unicode untuk whitespace (Zs, TAB, LF, FF, CR) dan tanda baca (kategori P dan S), sesuai CommonMark 0.31.2.
3. Label referensi tautan dicocokkan dengan case folding Unicode (`toLowerCase().toUpperCase()`), sehingga `[ẞ]` cocok dengan `[SS]`.
4. Slug heading mempertahankan huruf dan angka non-Latin (`# Café 日本` menjadi `café-日本`).
5. Entitas bernama mengikuti daftar WHATWG (2 125 entitas).

## 2. RTL

Library tidak menetapkan `dir`; pemanggil menambahkan `dir="auto"` atau `dir="rtl"` pada wadah HTML untuk teks Arab, Persia, atau Urdu.

*Lisensi dokumen: Apache-2.0 · © codinglombok*
