/**
 * Fuzz test — LombokMarkDown parser
 *
 * Target: `new Markdown(input).getHTML()` — tokenizer → parser → HTML compiler
 * pipeline. Ini satu-satunya jalur yang memproses teks arbitrer dari luar
 * (user-supplied markdown), jadi ini kandidat fuzz yang tepat: kita cari input
 * yang bikin exception tidak tertangani, infinite loop (lewat timeoutMs), atau
 * regex catastrophic backtracking di tokenizer/parser.
 *
 * Jalankan:
 *   npm run fuzz
 *
 * LombokFuzzer v0.1.x hanya mendukung harness in-process yang SINKRON
 * (lihat targetFunction: (data: Uint8Array) => void di lombokfuzzer/dist/types).
 * Markdown.getHTML() genuinely sync (tidak ada I/O), jadi cocok dipakai
 * langsung tanpa wrapper.
 */
import { LombokFuzzer, FuzzMode, HarnessMode, FuzzEvent } from 'lombokfuzzer'
import { Markdown } from '../../dist/index.js'

const fuzzer = new LombokFuzzer({
  name: 'lombokmarkdown-parser',
  mode: FuzzMode.Mutation,
  maxExecutions: Number(process.env.FUZZ_EXECUTIONS ?? 50_000),
  maxInputSize: 64 * 1024, // 64 KiB — dokumen markdown realistis jarang lebih besar
  timeoutMs: 2_000,
  harness: {
    mode: HarnessMode.InProcess,
    targetFunction: (data: Uint8Array) => {
      const text = Buffer.from(data).toString('utf-8')
      new Markdown(text).getHTML()
    },
  },
})

// Seed corpus — contoh valid yang mencakup tiap fitur GFM agar mutator
// punya titik tolak yang relevan (bukan mulai dari byte acak murni).
const seeds = [
  '# Hello\n\nThis is **bold** and *italic* text.',
  '## Heading\n\n- item 1\n- item 2\n  - nested\n\n1. first\n2. second',
  '```js\nconst x = 1;\n```',
  '[link](https://example.com "title") and ![image](pic.png)',
  '> blockquote\n> with multiple lines',
  '| a | b |\n| - | - |\n| 1 | 2 |',
  '~~strikethrough~~ and `inline code`',
  '---\n\nHorizontal rule above',
  'Line with  \ntrailing double-space break',
  '# Nested\n## Headings\n### Of\n#### Every\n##### Single\n###### Level',
]

for (const s of seeds) {
  fuzzer.addSeed(new TextEncoder().encode(s))
}

fuzzer.on(FuzzEvent.CrashFound, ({ crash }) => {
  console.error(
    `[CRASH] ${crash.id} — ${crash.category} (${crash.severity})` +
      (crash.isDuplicate ? ' [duplicate]' : ''),
  )
  const preview = Buffer.from(crash.input.data).toString('utf-8').slice(0, 200)
  console.error(`  input: ${JSON.stringify(preview)}`)
})

async function main() {
  console.log('Fuzzing LombokMarkDown parser...\n')
  const stats = await fuzzer.run()

  console.log(`\nExecutions   : ${stats.totalExecutions}`)
  console.log(`Exec/sec     : ${Math.round(stats.execsPerSecond)}`)
  console.log(`Corpus size  : ${stats.corpusSize}`)
  console.log(`Unique crashes : ${stats.uniqueCrashes}`)
  console.log(`Unique hangs   : ${stats.uniqueTimeouts}`)

  if (stats.uniqueCrashes > 0 || stats.uniqueTimeouts > 0) {
    console.error('\nFuzzing menemukan crash/hang — lihat detail di atas dan folder ./crashes')
    process.exit(1)
  }
  console.log('\nTidak ada crash ditemukan.')
}

main().catch((err) => {
  console.error('Fuzz runner gagal:', err)
  process.exit(1)
})
