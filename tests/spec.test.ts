/**
 * Conformance: every example of the CommonMark 0.31.2 spec (commonmark-spec package) and the
 * GFM 0.29 extension examples (tests/fixtures) must render byte-identically.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { Markdown } from '../src/index'

interface Example { markdown: string; html: string; section: string; number: number }

const require = createRequire(import.meta.url)
const commonmark = (require('commonmark-spec') as { tests: Example[] }).tests
const gfm = JSON.parse(readFileSync(new URL('./fixtures/gfm-0.29-extensions.json', import.meta.url), 'utf-8')) as Example[]
const tabs = (s: string) => s.replace(/→/g, '\t')

describe('CommonMark 0.31.2 spec', () => {
  it('has 652 examples', () => expect(commonmark).toHaveLength(652))
  for (const ex of commonmark) {
    it(`example ${ex.number} (${ex.section})`, () => {
      const html = new Markdown(tabs(ex.markdown), { gfm: false, html: true, safeLinks: false }).getHTML()
      expect(html).toBe(tabs(ex.html))
    })
  }
})

describe('GFM 0.29 extensions', () => {
  it('has 24 examples', () => expect(gfm).toHaveLength(24))
  for (const ex of gfm) {
    it(`example ${ex.number} (${ex.section})`, () => {
      const html = new Markdown(tabs(ex.markdown), { gfm: true, html: true, safeLinks: false }).getHTML()
      expect(html).toBe(tabs(ex.html))
    })
  }
})
