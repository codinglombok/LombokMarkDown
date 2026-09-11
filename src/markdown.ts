import { Tokenizer } from './tokenizer.js'
import { Parser, HTMLCompiler } from './parser.js'
import { Token, ASTNode, MarkdownOptions, MarkdownMetadata, TOCEntry } from './types.js'

/**
 * LombokMarkdown - Lightweight Markdown to HTML converter
 * 
 * Usage:
 *   const md = new Markdown("# Hello\n\nThis is **bold**")
 *   md.parse().getHTML() // => "<h1>Hello</h1><p>This is <strong>bold</strong></p>"
 */
export class Markdown {
  private input: string
  private options: MarkdownOptions
  private tokens: Token[] = []
  private ast: ASTNode[] = []
  private metadata: MarkdownMetadata = {
    headings: [],
    links: [],
    images: [],
    codeBlocks: []
  }
  private html: string = ''

  constructor(input: string, options?: MarkdownOptions) {
    this.input = input
    this.options = {
      gfm: true,
      breaks: false,
      ...options
    }
  }

  /**
   * Parse markdown text
   */
  parse(): this {
    // Stage 1: Tokenize
    const tokenizer = new Tokenizer(this.input)
    this.tokens = tokenizer.tokenize()

    // Stage 2: Parse to AST
    const parser = new Parser(this.tokens)
    this.ast = parser.parse()
    this.metadata = parser.getMetadata()

    // Stage 3: Compile to HTML
    const compiler = new HTMLCompiler()
    this.html = compiler.compile(this.ast)

    return this
  }

  /**
   * Get HTML output
   */
  getHTML(): string {
    if (!this.html) {
      this.parse()
    }
    return this.html
  }

  /**
   * Get AST nodes
   */
  getAST(): ASTNode[] {
    if (this.ast.length === 0) {
      this.parse()
    }
    return this.ast
  }

  /**
   * Get metadata (headings, links, images, code blocks)
   */
  getMetadata(): MarkdownMetadata {
    if (Object.keys(this.metadata).some(k => (this.metadata as any)[k].length === 0)) {
      this.parse()
    }
    return this.metadata
  }

  /**
   * Get table of contents from headings
   */
  getTableOfContents(): TOCEntry[] {
    const headings = this.getMetadata().headings
    const toc: TOCEntry[] = []
    const stack: TOCEntry[] = []

    for (const heading of headings) {
      const entry: TOCEntry = {
        level: heading.level,
        text: heading.text,
        id: this.generateId(heading.text),
        children: []
      }

      // Find parent
      while (stack.length > 0 && stack[stack.length - 1].level >= entry.level) {
        stack.pop()
      }

      if (stack.length === 0) {
        toc.push(entry)
      } else {
        const parent = stack[stack.length - 1]
        if (!parent.children) parent.children = []
        parent.children.push(entry)
      }

      stack.push(entry)
    }

    return toc
  }

  /**
   * Convert to JSON
   */
  toJSON(): {
    ast: ASTNode[]
    metadata: MarkdownMetadata
    html: string
  } {
    if (!this.html) this.parse()

    return {
      ast: this.ast,
      metadata: this.metadata,
      html: this.html
    }
  }

  /**
   * Get list of all links
   */
  getLinks(): Array<{ text: string; url: string; title?: string }> {
    return this.getMetadata().links
  }

  /**
   * Get list of all images
   */
  getImages(): Array<{ alt: string; src: string; title?: string }> {
    return this.getMetadata().images
  }

  /**
   * Get all code blocks
   */
  getCodeBlocks(): Array<{ lang?: string; code: string }> {
    return this.getMetadata().codeBlocks
  }

  /**
   * Get all headings
   */
  getHeadings(): Array<{ level: number; text: string }> {
    return this.getMetadata().headings
  }

  private generateId(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }
}

export { ASTNode, MarkdownMetadata, MarkdownOptions, TOCEntry }
