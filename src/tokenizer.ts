import { Token } from './types.js'

/**
 * Tokenizes Markdown text into tokens
 * Stage 1 of parsing: break down raw text into logical units
 */
export class Tokenizer {
  private text: string
  private pos: number = 0
  private line: number = 1

  constructor(text: string) {
    this.text = text
  }

  tokenize(): Token[] {
    const tokens: Token[] = []

    while (this.pos < this.text.length) {
      this.skipWhitespace()
      if (this.pos >= this.text.length) break

      const token = this.nextToken()
      if (token) {
        tokens.push(token)
      }
    }

    return tokens
  }

  private nextToken(): Token | null {
    const char = this.text[this.pos]
    const start = this.pos

    // Heading
    if (char === '#') {
      return this.tokenizeHeading()
    }

    // Horizontal rule
    if (this.matchesHorizontalRule()) {
      return this.tokenizeHorizontalRule()
    }

    // List (- or *)
    if ((char === '-' || char === '*' || char === '+') && this.isListStart()) {
      return this.tokenizeList()
    }

    // Ordered list (1. 2. etc)
    if (/\d/.test(char) && this.matchesOrderedList()) {
      return this.tokenizeOrderedList()
    }

    // Blockquote
    if (char === '>') {
      return this.tokenizeBlockquote()
    }

    // Code block (indented or fenced)
    if (char === '`' && this.peekNext() === '`' && this.peekNext(2) === '`') {
      return this.tokenizeCodeBlock()
    }

    // Paragraph (default)
    if (char && char.trim()) {
      return this.tokenizeParagraph()
    }

    this.pos++
    return null
  }

  private tokenizeHeading(): Token {
    const start = this.pos
    let level = 0

    while (this.pos < this.text.length && this.text[this.pos] === '#') {
      level++
      this.pos++
    }

    level = Math.min(level, 6) // Max 6 levels

    // Skip whitespace after #
    while (this.pos < this.text.length && /[ \t]/.test(this.text[this.pos])) {
      this.pos++
    }

    // Get heading text until EOL
    const textStart = this.pos
    while (this.pos < this.text.length && this.text[this.pos] !== '\n') {
      this.pos++
    }

    const text = this.text.slice(textStart, this.pos).trim()
    this.pos++ // Skip \n

    return {
      type: 'heading',
      raw: this.text.slice(start, this.pos),
      text,
      level,
      line: this.line++
    }
  }

  private tokenizeParagraph(): Token {
    const start = this.pos

    // Read until double newline or another block element
    while (this.pos < this.text.length) {
      if (this.text[this.pos] === '\n' && this.text[this.pos + 1] === '\n') {
        break
      }
      if (this.isBlockStart()) {
        break
      }
      this.pos++
      if (this.text[this.pos - 1] === '\n') this.line++
    }

    const text = this.text.slice(start, this.pos).trim()

    return {
      type: 'paragraph',
      raw: this.text.slice(start, this.pos),
      text,
      line: this.line
    }
  }

  private tokenizeCodeBlock(): Token {
    const start = this.pos

    // Skip opening ```
    this.pos += 3

    // Get language identifier
    const langStart = this.pos
    while (this.pos < this.text.length && this.text[this.pos] !== '\n') {
      this.pos++
    }
    const lang = this.text.slice(langStart, this.pos).trim()
    this.pos++ // Skip \n

    // Get code until closing ```
    const codeStart = this.pos
    while (this.pos < this.text.length) {
      if (this.text[this.pos] === '`' && 
          this.text[this.pos + 1] === '`' && 
          this.text[this.pos + 2] === '`') {
        break
      }
      if (this.text[this.pos] === '\n') this.line++
      this.pos++
    }

    const code = this.text.slice(codeStart, this.pos)
    this.pos += 3 // Skip closing ```
    if (this.text[this.pos] === '\n') this.pos++ // Skip trailing newline

    return {
      type: 'codeBlock',
      raw: this.text.slice(start, this.pos),
      code: code.trim(),
      lang: lang || undefined
    }
  }

  private tokenizeBlockquote(): Token {
    const start = this.pos
    const lines: string[] = []

    while (this.pos < this.text.length && this.text[this.pos] === '>') {
      this.pos++ // Skip >
      if (this.text[this.pos] === ' ') this.pos++ // Skip space

      const lineStart = this.pos
      while (this.pos < this.text.length && this.text[this.pos] !== '\n') {
        this.pos++
      }

      lines.push(this.text.slice(lineStart, this.pos).trim())

      if (this.text[this.pos] === '\n') {
        this.pos++
        this.line++
      }
    }

    return {
      type: 'blockquote',
      raw: this.text.slice(start, this.pos),
      text: lines.join('\n')
    }
  }

  private tokenizeList(): Token {
    const start = this.pos
    const marker = this.text[this.pos]
    const items: Token[] = []

    while (this.pos < this.text.length && (this.text[this.pos] === '-' || this.text[this.pos] === '*' || this.text[this.pos] === '+')) {
      this.pos++ // Skip marker
      if (this.text[this.pos] === ' ') this.pos++

      const itemStart = this.pos
      while (this.pos < this.text.length && this.text[this.pos] !== '\n') {
        this.pos++
      }

      const text = this.text.slice(itemStart, this.pos).trim()
      items.push({ type: 'listItem', raw: text, text })

      if (this.text[this.pos] === '\n') {
        this.pos++
        this.line++
      }
    }

    return {
      type: 'list',
      raw: this.text.slice(start, this.pos),
      ordered: false,
      items
    }
  }

  private tokenizeOrderedList(): Token {
    const start = this.pos
    const items: Token[] = []
    let number = 0

    while (this.pos < this.text.length && /\d/.test(this.text[this.pos])) {
      // Parse number
      const numStart = this.pos
      while (this.pos < this.text.length && /\d/.test(this.text[this.pos])) {
        this.pos++
      }
      const num = parseInt(this.text.slice(numStart, this.pos))
      if (number === 0) number = num

      // Skip . and space
      if (this.text[this.pos] === '.') this.pos++
      if (this.text[this.pos] === ' ') this.pos++

      // Get item text
      const itemStart = this.pos
      while (this.pos < this.text.length && this.text[this.pos] !== '\n') {
        this.pos++
      }

      const text = this.text.slice(itemStart, this.pos).trim()
      items.push({ type: 'listItem', raw: text, text })

      if (this.text[this.pos] === '\n') {
        this.pos++
        this.line++
      }
    }

    return {
      type: 'list',
      raw: this.text.slice(start, this.pos),
      ordered: true,
      start: number,
      items
    }
  }

  private tokenizeHorizontalRule(): Token {
    const start = this.pos
    const char = this.text[this.pos]

    while (this.pos < this.text.length && this.text[this.pos] === char) {
      this.pos++
    }

    if (this.text[this.pos] === '\n') this.pos++

    return {
      type: 'horizontalRule',
      raw: this.text.slice(start, this.pos)
    }
  }

  // Helper methods
  private isListStart(): boolean {
    const next = this.text[this.pos + 1]
    return next === ' ' || next === '\t'
  }

  private matchesOrderedList(): boolean {
    let i = this.pos
    while (i < this.text.length && /\d/.test(this.text[i])) i++
    return this.text[i] === '.'
  }

  private matchesHorizontalRule(): boolean {
    const char = this.text[this.pos]
    if (char !== '-' && char !== '*' && char !== '_') return false

    let count = 0
    let i = this.pos
    while (i < this.text.length && this.text[i] === char) {
      count++
      i++
    }

    return count >= 3 && (i >= this.text.length || this.text[i] === '\n')
  }

  private isBlockStart(): boolean {
    return /^#{1,6}\s/.test(this.text.slice(this.pos)) ||
           /^>\s/.test(this.text.slice(this.pos)) ||
           /^-{3,}\n/.test(this.text.slice(this.pos))
  }

  private skipWhitespace(): void {
    while (this.pos < this.text.length && /\s/.test(this.text[this.pos])) {
      if (this.text[this.pos] === '\n') this.line++
      this.pos++
    }
  }

  private peekNext(offset: number = 1): string {
    return this.text[this.pos + offset] || ''
  }
}
