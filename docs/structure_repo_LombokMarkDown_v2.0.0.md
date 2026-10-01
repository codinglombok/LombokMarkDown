# LombokMarkDown — Structure Repo v2.0.0

```
LombokMarkDown/
├── README.md · CHANGELOG.md · UPGRADE.md · CONTRIBUTING.md · SECURITY.md · LICENSE (Apache-2.0) · NOTICE
├── package.json · package-lock.json · tsconfig.json · tsconfig.check.json · vitest.config.ts
├── .github/             workflows/ci.yml · workflows/pages.yml · dependabot.yml
├── src/
│   ├── blocks.ts        parser blok (strategi lampiran CommonMark) + tabel GFM + daftar tugas
│   ├── inlines.ts       parser inline (delimiter stack, tautan, autolink GFM)
│   ├── render.ts        renderer HTML iteratif, mode aman, Slugger
│   ├── markdown.ts      API publik, AST, metadata, daftar isi
│   ├── node.ts          pohon dokumen + walker iteratif
│   ├── common.ts        escaping, entitas, normalisasi URI dan label
│   ├── entities.ts      2 125 entitas WHATWG (data BSD-2-Clause, lihat NOTICE)
│   └── types.ts · index.ts
├── tests/
│   ├── spec.test.ts     652 contoh CommonMark + 24 contoh GFM
│   ├── vectors.test.ts  runner vector
│   ├── pathological.test.ts · markdown.test.ts
│   ├── fixtures/        contoh ekstensi GFM 0.29 (CC-BY-SA 4.0, bukan bagian paket npm)
│   └── fuzz/markdown.fuzz.ts
├── vectors/             lombokmarkdown-vectors-v1.json · SHA256SUMS · build_vectors.py
├── scripts/             lombok-doctor.sh
├── ports/               go/ · php/ · python/ (stub)
└── docs/                10 dokumen publik + index.html; masterplan_/architecture_ internal (ADR-024)
```

*Lisensi dokumen: Apache-2.0 · © codinglombok*
