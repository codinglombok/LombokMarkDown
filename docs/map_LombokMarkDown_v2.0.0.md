# LombokMarkDown — Map v2.0.0

## 1. Posisi di ekosistem

```
Cluster 03 Format, Parser & Serialisasi · tingkat L0 (tanpa dependensi Lombok wajib)

L0  LombokMarkDown
     dependensi wajib    : (tidak ada)
     dependensi opsional : (tidak ada)
     dependensi dev      : lombokfuzzer, commonmark-spec (data uji)
     pasangan yang disarankan: LombokHTML (sanitasi) bila opsi html: true dipakai untuk masukan tak tepercaya
```

## 2. Contoh pemakai di ekosistem

| Pemakai | Pemakaian |
|---|---|
| LombokPDF (aplikasi) | impor Markdown ke PDF |
| LombokRAGFrameworks (aplikasi) | loader Markdown, potongan per heading |
| LombokClarion (framework, opsional) | render konten pengguna |

## 3. Fitur x port

| Fitur | TypeScript | Python | Go | PHP |
|---|---|---|---|---|
| CommonMark 0.31.2 | YA (652/652) | stub | stub | stub |
| GFM 0.29 | YA (24/24) | stub | stub | stub |
| Mode aman, slug, TOC, metadata, AST | YA (114 vector) | stub | stub | stub |

*Lisensi dokumen: Apache-2.0 · © codinglombok*
