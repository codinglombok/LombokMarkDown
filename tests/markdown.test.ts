import { describe, it, expect } from 'vitest'
import { Markdown } from '../src/markdown'

describe('LombokMarkdown - Basic Parsing', () => {
  it('parses headings (h1-h6)', () => {
    const md = new Markdown('# H1\n## H2\n### H3')
    const html = md.parse().getHTML()
    expect(html).toContain('<h1>H1</h1>')
    expect(html).toContain('<h2>H2</h2>')
    expect(html).toContain('<h3>H3</h3>')
  })

  it('parses paragraphs', () => {
    const md = new Markdown('This is a paragraph.\n\nThis is another.')
    const html = md.parse().getHTML()
    expect(html).toContain('<p>This is a paragraph.</p>')
    expect(html).toContain('<p>This is another.</p>')
  })

  it('parses bold text', () => {
    const md = new Markdown('This is **bold** text')
    const html = md.parse().getHTML()
    expect(html).toContain('<strong>bold</strong>')
  })

  it('parses italic text', () => {
    const md = new Markdown('This is *italic* text')
    const html = md.parse().getHTML()
    expect(html).toContain('<em>italic</em>')
  })

  it('parses inline code', () => {
    const md = new Markdown('Use `const x = 5` in your code')
    const html = md.parse().getHTML()
    expect(html).toContain('<code>const x = 5</code>')
  })

  it('parses code blocks with language', () => {
    const md = new Markdown('```javascript\nconst x = 5\n```')
    const html = md.parse().getHTML()
    expect(html).toContain('<pre><code class="language-javascript">')
    expect(html).toContain('const x = 5')
  })

  it('parses unordered lists', () => {
    const md = new Markdown('- Item 1\n- Item 2\n- Item 3')
    const html = md.parse().getHTML()
    expect(html).toContain('<ul>')
    expect(html).toContain('<li>Item 1</li>')
    expect(html).toContain('<li>Item 2</li>')
    expect(html).toContain('</ul>')
  })

  it('parses ordered lists', () => {
    const md = new Markdown('1. First\n2. Second\n3. Third')
    const html = md.parse().getHTML()
    expect(html).toContain('<ol start="1">')
    expect(html).toContain('<li>First</li>')
    expect(html).toContain('</ol>')
  })

  it('parses blockquotes', () => {
    const md = new Markdown('> This is a quote\n> with multiple lines')
    const html = md.parse().getHTML()
    expect(html).toContain('<blockquote>')
  })

  it('parses horizontal rules', () => {
    const md = new Markdown('---')
    const html = md.parse().getHTML()
    expect(html).toContain('<hr />')
  })
})

describe('LombokMarkdown - Links and Images', () => {
  it('parses links', () => {
    const md = new Markdown('Check [this link](https://example.com)')
    const html = md.parse().getHTML()
    expect(html).toContain('<a href="https://example.com">this link</a>')
  })

  it('parses images', () => {
    const md = new Markdown('![alt text](https://example.com/image.jpg)')
    const html = md.parse().getHTML()
    expect(html).toContain('<img src="https://example.com/image.jpg" alt="alt text"')
  })

  it('extracts links in metadata', () => {
    const md = new Markdown('Visit [link1](https://example1.com) and [link2](https://example2.com)')
    md.parse()
    const links = md.getMetadata().links
    expect(links).toHaveLength(2)
    expect(links[0]).toEqual({ text: 'link1', url: 'https://example1.com' })
  })

  it('extracts images in metadata', () => {
    const md = new Markdown('![alt1](img1.jpg) and ![alt2](img2.jpg)')
    md.parse()
    const images = md.getMetadata().images
    expect(images).toHaveLength(2)
    expect(images[0]).toEqual({ alt: 'alt1', src: 'img1.jpg' })
  })
})

describe('LombokMarkdown - Metadata Extraction', () => {
  it('extracts headings', () => {
    const md = new Markdown('# Title\n## Subtitle\n### Section')
    md.parse()
    const headings = md.getHeadings()
    expect(headings).toHaveLength(3)
    expect(headings[0]).toEqual({ level: 1, text: 'Title' })
  })

  it('extracts code blocks', () => {
    const md = new Markdown('```js\ncode here\n```')
    md.parse()
    const blocks = md.getCodeBlocks()
    expect(blocks).toHaveLength(1)
    expect(blocks[0].lang).toBe('js')
  })

  it('generates table of contents', () => {
    const md = new Markdown('# Main\n## Sub1\n## Sub2\n### Sub2-1')
    md.parse()
    const toc = md.getTableOfContents()
    expect(toc).toHaveLength(1)
    expect(toc[0].children).toHaveLength(2)
  })
})

describe('LombokMarkdown - HTML Escaping', () => {
  it('escapes HTML entities', () => {
    const md = new Markdown('Test <script>alert("xss")</script>')
    const html = md.parse().getHTML()
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('escapes quotes in attributes', () => {
    const md = new Markdown('Test [link](javascript:alert("xss"))')
    const html = md.parse().getHTML()
    expect(html).toContain('&quot;')
  })
})

describe('LombokMarkdown - Complex Documents', () => {
  it('handles mixed markdown', () => {
    const doc = `
# Main Title

This is a paragraph with **bold** and *italic* text.

## Section 1

- Item 1
- Item 2

Here's a [link](https://example.com).

\`\`\`typescript
const greeting = "Hello, World!"
\`\`\`

> A quote for inspiration

---

1. First step
2. Second step
3. Third step
`.trim()

    const md = new Markdown(doc)
    const html = md.parse().getHTML()
    
    expect(html).toContain('<h1>Main Title</h1>')
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<em>italic</em>')
    expect(html).toContain('<ul>')
    expect(html).toContain('<ol start="1">')
    expect(html).toContain('<blockquote>')
    expect(html).toContain('<hr />')
  })

  it('generates correct metadata for complex doc', () => {
    const doc = '# Title\n## Subtitle\n![img](test.jpg)\n[link](http://ex.com)'
    const md = new Markdown(doc)
    md.parse()
    const meta = md.getMetadata()

    expect(meta.headings).toHaveLength(2)
    expect(meta.images).toHaveLength(1)
    expect(meta.links).toHaveLength(1)
  })

  it('extracts code blocks from metadata', () => {
    const md = new Markdown('```javascript\nconst x = 5\n```')
    md.parse()
    const meta = md.getMetadata()
    expect(meta.codeBlocks).toHaveLength(1)
    expect(meta.codeBlocks[0].lang).toBe('javascript')
  })
})

describe('LombokMarkdown - Public API', () => {
  it('supports method chaining', () => {
    const html = new Markdown('# Test').parse().getHTML()
    expect(html).toContain('<h1>Test</h1>')
  })

  it('returns JSON export', () => {
    const md = new Markdown('# Title\n\nParagraph')
    md.parse()
    const json = md.toJSON()
    expect(json).toHaveProperty('ast')
    expect(json).toHaveProperty('metadata')
    expect(json).toHaveProperty('html')
  })

  it('provides getLinks shortcut', () => {
    const md = new Markdown('[link](url)')
    md.parse()
    const links = md.getLinks()
    expect(links).toHaveLength(1)
    expect(links[0].url).toBe('url')
  })

  it('provides getImages shortcut', () => {
    const md = new Markdown('![alt](src)')
    md.parse()
    const images = md.getImages()
    expect(images).toHaveLength(1)
    expect(images[0].src).toBe('src')
  })

  it('provides getCodeBlocks shortcut', () => {
    const md = new Markdown('```\ncode\n```')
    md.parse()
    const blocks = md.getCodeBlocks()
    expect(blocks).toHaveLength(1)
  })
})
