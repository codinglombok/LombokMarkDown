/**
 * LombokMarkdown - Type definitions
 */

export interface MarkdownOptions {
  gfm?: boolean                          // GitHub Flavored Markdown
  breaks?: boolean                       // Convert \n to <br>
  pedantic?: boolean                     // Strict spec compliance
  smartLists?: boolean                   // Better list handling
  smartypants?: boolean                  // Typographic replacements
}

export interface Token {
  type: string
  raw: string
  text?: string
  level?: number
  items?: Token[]
  ordered?: boolean
  start?: number
  loose?: boolean
  delimiter?: string
  href?: string
  title?: string
  alt?: string
  indent?: string
  code?: string
  lang?: string
  escaped?: boolean
  pre?: boolean
  line?: number
}

export interface ASTNode {
  type: 'root' | 'heading' | 'paragraph' | 'list' | 'listItem' | 'blockquote' | 'codeBlock' | 'horizontalRule' | 'thematicBreak' | 'html' | 'table' | 'tableRow' | 'tableCell' | 'text' | 'strong' | 'emphasis' | 'code' | 'link' | 'image' | 'lineBreak' | 'softBreak' | 'delete'
  raw?: string
  depth?: number                         // For headings (1-6)
  children?: ASTNode[]
  value?: string
  lang?: string                          // For code blocks
  ordered?: boolean                      // For lists
  start?: number                         // For ordered lists
  loose?: boolean                        // For list items
  align?: 'left' | 'center' | 'right'   // For tables
  header?: boolean                       // For table cells
  href?: string                          // For links/images
  title?: string                         // For links/images
  alt?: string                           // For images
  inline?: boolean                       // For emphasis, strong, code
}

export interface MarkdownMetadata {
  headings: { level: number; text: string }[]
  links: { text: string; url: string; title?: string }[]
  images: { alt: string; src: string; title?: string }[]
  codeBlocks: { lang?: string; code: string }[]
}

export interface HTMLOptions {
  classMap?: Record<string, string>
  idPrefix?: string
  sanitize?: boolean
}

export interface TOCEntry {
  level: number
  text: string
  id: string
  children?: TOCEntry[]
}
