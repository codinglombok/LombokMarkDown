/**
 * Vector runner (GP-11): executes every case in vectors/lombokmarkdown-vectors-v1.json.
 * Objects are compared as JSON with sorted keys.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { Markdown, type MarkdownOptions } from '../src/index'

interface Case { id: string; fn: string; input: string; options?: MarkdownOptions; expected: unknown }

const doc = JSON.parse(readFileSync(new URL('../vectors/lombokmarkdown-vectors-v1.json', import.meta.url), 'utf-8')) as { cases: Case[] }

function canonical(v: unknown): string {
  return JSON.stringify(v, (_k, val) =>
    val && typeof val === 'object' && !Array.isArray(val)
      ? Object.fromEntries(Object.keys(val).sort().map(k => [k, (val as Record<string, unknown>)[k]]))
      : val)
}

function run(c: Case): unknown {
  const md = new Markdown(c.input, c.options)
  switch (c.fn) {
    case 'html': return md.getHTML()
    case 'metadata': return md.getMetadata()
    case 'toc': return md.getTableOfContents()
    case 'ast': return md.getAST()
    default: throw new Error(`unknown fn ${c.fn}`)
  }
}

describe('lombokmarkdown vectors v1', () => {
  it('has at least 100 cases', () => expect(doc.cases.length).toBeGreaterThanOrEqual(100))
  for (const c of doc.cases) {
    it(c.id, () => expect(canonical(run(c))).toBe(canonical(c.expected)))
  }
})
