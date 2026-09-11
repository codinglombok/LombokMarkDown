import { Token, ASTNode, MarkdownMetadata } from './types.js'

/**
 * Parses tokens into an Abstract Syntax Tree (AST)
 * And compiles AST to semantic HTML
 */
export class Parser {
  private tokens: Token[]
  private pos: number = 0
  private ast: ASTNode[] = []
  private metadata: MarkdownMetadata = {
    headings: [],
    links: [],
    images: [],
    codeBlocks: []
  }

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  parse(): ASTNode[] {
    while (this.pos < this.tokens.length) {
      const token = this.tokens[this.pos]
      const node = this.tokenToNode(token)
      if (node) {
        this.ast.push(node)
      }
      this.pos++
    }

    return this.ast
  }

  getMetadata(): MarkdownMetadata {
    return this.metadata
  }

  private tokenToNode(token: Token): ASTNode | null {
    const node: ASTNode = {
      type: (token.type as any) || 'text'
    }

    switch (token.type) {
      case 'heading':
        this.metadata.headings.push({
          level: token.level || 1,
          text: token.text || ''
        })
        return {
          type: 'heading',
          depth: token.level || 1,
          children: this.parseInline(token.text || '')
        }

      case 'paragraph':
        return {
          type: 'paragraph',
          children: this.parseInline(token.text || '')
        }

      case 'codeBlock':
        this.metadata.codeBlocks.push({
          lang: token.lang,
          code: token.code || ''
        })
        return {
          type: 'codeBlock',
          value: token.code || '',
          lang: token.lang
        }

      case 'blockquote':
        return {
          type: 'blockquote',
          children: this.parseInline(token.text || '')
        }

      case 'list':
        return {
          type: 'list',
          ordered: token.ordered || false,
          start: token.start,
          children: (token.items || []).map(item => ({
            type: 'listItem' as const,
            children: this.parseInline(item.text || '')
          }))
        }

      case 'horizontalRule':
        return {
          type: 'thematicBreak'
        }

      default:
        return null
    }
  }

  private parseInline(text: string): ASTNode[] {
    const nodes: ASTNode[] = []
    let current = ''
    let i = 0

    while (i < text.length) {
      // Bold **text**
      if (text[i] === '*' && text[i + 1] === '*') {
        if (current) nodes.push({ type: 'text', value: current })
        current = ''

        i += 2
        const start = i
        while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) {
          i++
        }

        nodes.push({
          type: 'strong',
          children: [{ type: 'text', value: text.slice(start, i) }]
        })
        i += 2
        continue
      }

      // Italic *text*
      if (text[i] === '*' || text[i] === '_') {
        const marker = text[i]
        if (current) nodes.push({ type: 'text', value: current })
        current = ''

        i++
        const start = i
        while (i < text.length && text[i] !== marker) {
          i++
        }

        nodes.push({
          type: 'emphasis',
          children: [{ type: 'text', value: text.slice(start, i) }]
        })
        i++
        continue
      }

      // Code `text`
      if (text[i] === '`') {
        if (current) nodes.push({ type: 'text', value: current })
        current = ''

        i++
        const start = i
        while (i < text.length && text[i] !== '`') {
          i++
        }

        nodes.push({
          type: 'code',
          value: text.slice(start, i)
        })
        i++
        continue
      }

      // Link [text](url)
      if (text[i] === '[') {
        if (current) nodes.push({ type: 'text', value: current })
        current = ''

        i++
        const textStart = i
        while (i < text.length && text[i] !== ']') {
          i++
        }
        const linkText = text.slice(textStart, i)
        i++ // Skip ]

        if (text[i] === '(') {
          i++
          const urlStart = i
          while (i < text.length && text[i] !== ')') {
            i++
          }
          const href = text.slice(urlStart, i)
          this.metadata.links.push({ text: linkText, url: href })
          nodes.push({
            type: 'link',
            href,
            children: [{ type: 'text', value: linkText }]
          })
          i++
          continue
        }
      }

      // Image ![alt](src)
      if (text[i] === '!' && text[i + 1] === '[') {
        if (current) nodes.push({ type: 'text', value: current })
        current = ''

        i += 2
        const altStart = i
        while (i < text.length && text[i] !== ']') {
          i++
        }
        const alt = text.slice(altStart, i)
        i++ // Skip ]

        if (text[i] === '(') {
          i++
          const urlStart = i
          while (i < text.length && text[i] !== ')') {
            i++
          }
          const src = text.slice(urlStart, i)
          this.metadata.images.push({ alt, src })
          nodes.push({
            type: 'image',
            alt,
            href: src
          })
          i++
          continue
        }
      }

      current += text[i]
      i++
    }

    if (current) {
      nodes.push({ type: 'text', value: current })
    }

    return nodes
  }
}

/**
 * Compiles AST to HTML
 */
export class HTMLCompiler {
  compile(nodes: ASTNode[]): string {
    return nodes.map(node => this.compileNode(node)).join('')
  }

  private compileNode(node: ASTNode): string {
    switch (node.type) {
      case 'heading':
        const level = node.depth || 1
        const content = node.children
          ?.map(child => this.compileNode(child))
          .join('') || ''
        return `<h${level}>${content}</h${level}>`

      case 'paragraph':
        const pContent = node.children
          ?.map(child => this.compileNode(child))
          .join('') || ''
        return `<p>${pContent}</p>`

      case 'codeBlock':
        const classes = node.lang ? ` class="language-${node.lang}"` : ''
        return `<pre><code${classes}>${this.escape(node.value || '')}</code></pre>`

      case 'blockquote':
        const bqContent = node.children
          ?.map(child => this.compileNode(child))
          .join('') || ''
        return `<blockquote>${bqContent}</blockquote>`

      case 'list':
        const tag = node.ordered ? 'ol' : 'ul'
        const startAttr = node.ordered && node.start ? ` start="${node.start}"` : ''
        const listContent = node.children
          ?.map(child => this.compileNode(child))
          .join('') || ''
        return `<${tag}${startAttr}>${listContent}</${tag}>`

      case 'listItem':
        const liContent = node.children
          ?.map(child => this.compileNode(child))
          .join('') || ''
        return `<li>${liContent}</li>`

      case 'text':
        return this.escape(node.value || '')

      case 'strong':
        const strongContent = node.children
          ?.map(child => this.compileNode(child))
          .join('') || ''
        return `<strong>${strongContent}</strong>`

      case 'emphasis':
        const emContent = node.children
          ?.map(child => this.compileNode(child))
          .join('') || ''
        return `<em>${emContent}</em>`

      case 'code':
        return `<code>${this.escape(node.value || '')}</code>`

      case 'link':
        const linkContent = node.children
          ?.map(child => this.compileNode(child))
          .join('') || ''
        const title = node.title ? ` title="${this.escape(node.title)}"` : ''
        return `<a href="${this.escape(node.href || '')}"${title}>${linkContent}</a>`

      case 'image':
        return `<img src="${this.escape(node.href || '')}" alt="${this.escape(node.alt || '')}" />`

      case 'thematicBreak':
        return '<hr />'

      default:
        return ''
    }
  }

  private escape(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
}
