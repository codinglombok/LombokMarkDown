/**
 * Pathological inputs (SPEC §3.5): adversarial patterns that make naive Markdown parsers
 * quadratic or overflow the stack. Each must finish well within the time limit.
 */
import { describe, expect, it } from 'vitest'
import { Markdown } from '../src/index'

const N = 20000
const N2 = 100000
const LIMIT_MS = 5000

const cases: Record<string, string> = {
  'nested strong and emphasis': '*a **a '.repeat(N) + 'b' + ' a** a*'.repeat(N),
  'emphasis closers without openers': 'a_ '.repeat(N),
  'emphasis openers without closers': '_a '.repeat(N),
  'link closers': 'a]'.repeat(N),
  'link openers': '[a'.repeat(N),
  'mismatched openers and closers': '*a_ '.repeat(N),
  'openers and closers multiple of 3': 'a**b' + 'c* '.repeat(N),
  'link openers and emphasis closers': '[ a_'.repeat(N),
  'pattern [ (](': '[ (]('.repeat(N),
  'nested brackets': '['.repeat(N) + 'a' + ']'.repeat(N),
  'nested block quotes': '> '.repeat(N) + 'a',
  'deeply nested lists': Array.from({ length: 1000 }, (_, i) => '  '.repeat(i) + '* a\n').join(''),
  'NUL characters': 'abc\u0000de\u0000'.repeat(N),
  'backtick runs': Array.from({ length: 2000 }, (_, i) => 'e' + '`'.repeat(i)).join(''),
  'unclosed links <': '[a](<b'.repeat(N),
  'unclosed links': '[a](b'.repeat(N),
  'long table': '| a |\n| - |\n' + '| b |\n'.repeat(N),
  'extended autolinks': 'www.a.b '.repeat(N),
  'many reference definitions': Array.from({ length: N }, (_, i) => `[x${i}]: /u${i}\n`).join('') + '[x1]',
  'nested emphasis stars': '*'.repeat(N) + 'a' + '*'.repeat(N),
  'unclosed HTML comments': '<!--'.repeat(N),
  'many entities': '&amp;'.repeat(N),
  // found by CodeQL and a scaling check; N2 is large enough that a quadratic path exceeds the limit
}

const linearOnly: Record<string, string> = {
  'table cell with long blank run': '| a |\n| - |\n| x' + '\t'.repeat(N2) + 'y |',
  'delimiter row with long blank run': 'a | b\n-' + '\t'.repeat(N2) + 'x',
  'ATX heading with long blank run': '# a' + '\t'.repeat(N2) + 'x',
  'indented code with many blank lines': '    a' + '\n    '.repeat(N2) + 'b',
  'paragraph with long inner blank run': 'a' + ' \t'.repeat(N2) + 'b',
  'text with long inner space run before hard break': 'x' + ' '.repeat(N2) + 'y  \nz',
  'autolink with long punctuation tail': 'www.a.b/' + '?'.repeat(N2) + 'x',
  'unclosed comments after text': 'x <!--'.repeat(N2),
  'unclosed link titles in parentheses': '[a](b ('.repeat(N2),
}

describe('pathological inputs', () => {
  for (const [name, input] of Object.entries({ ...cases, ...linearOnly })) {
    it(name, () => {
      const t = performance.now()
      const md = new Markdown(input, { html: true, headingIds: true })
      expect(typeof md.getHTML()).toBe('string')
      md.getAST()
      md.getTableOfContents()
      expect(performance.now() - t).toBeLessThan(LIMIT_MS)
    }, LIMIT_MS * 3)
  }
})
