/**
 * Shared helpers: escaping, entity decoding, URI normalisation, link labels.
 */
import { namedEntity } from './entities.js'

export const ESCAPABLE = '[!"#$%&\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]'
const ENTITY = '&(?:#x[a-f0-9]{1,6}|#[0-9]{1,7}|[a-z][a-z0-9]{1,31});'
const reBackslashOrAmp = /[\\&]/
const reEntityOrEscapedChar = new RegExp('\\\\' + ESCAPABLE + '|' + ENTITY, 'gi')
export const reEntityHere = new RegExp('^' + ENTITY, 'i')

/** Decodes one entity such as `&amp;`, `&#35;` or `&#x22;`; returns the input when unknown. */
export function decodeEntity(entity: string): string {
  if (entity[1] === '#') {
    const hex = entity[2] === 'x' || entity[2] === 'X'
    const cp = parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10)
    if (cp === 0 || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff) || Number.isNaN(cp)) return '�'
    return String.fromCodePoint(cp)
  }
  return namedEntity(entity.slice(1, -1)) ?? entity
}

/** Resolves backslash escapes and entities (used for link destinations, titles, info strings). */
export function unescapeString(s: string): string {
  if (!reBackslashOrAmp.test(s)) return s
  return s.replace(reEntityOrEscapedChar, m => (m[0] === '\\' ? m[1] : decodeEntity(m)))
}

const reNeedsEscape = /[&<>"]/
const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }

/** Escapes text for HTML content and double-quoted attributes. */
export function escapeHTML(s: string): string {
  return reNeedsEscape.test(s) ? s.replace(/[&<>"]/g, c => ESC[c]) : s
}

const URI_SAFE = /[A-Za-z0-9;/?:@&=+$,\-_.!~*'()#]/

/** Percent-encodes a URL the way CommonMark reference implementations do (existing %XX kept). */
export function normalizeURI(uri: string): string {
  let out = ''
  for (let i = 0; i < uri.length; i++) {
    const c = uri[i]
    if (c === '%' && /^[0-9a-fA-F]{2}$/.test(uri.slice(i + 1, i + 3))) {
      out += uri.slice(i, i + 3)
      i += 2
      continue
    }
    if (URI_SAFE.test(c)) {
      out += c
      continue
    }
    const code = uri.charCodeAt(i)
    let ch = c
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < uri.length) {
      const next = uri.charCodeAt(i + 1)
      if (next >= 0xdc00 && next <= 0xdfff) {
        ch = uri.slice(i, i + 2)
        i++
      } else {
        ch = '�'
      }
    } else if (code >= 0xd800 && code <= 0xdfff) {
      ch = '�'
    }
    for (const b of new TextEncoder().encode(ch)) out += '%' + b.toString(16).toUpperCase().padStart(2, '0')
  }
  return out
}

/** Link label matching: collapse whitespace, trim, Unicode case fold (SPEC §4.7). */
export function normalizeReference(label: string): string {
  return label.slice(1, -1).trim().replace(/[ \t\r\n]+/g, ' ').toLowerCase().toUpperCase()
}

export function isSpaceOrTab(c: string | undefined): boolean {
  return c === ' ' || c === '\t'
}

// --- raw HTML (CommonMark 0.31.2 §6.6) --------------------------------------
const TAGNAME = '[A-Za-z][A-Za-z0-9-]*'
const ATTRIBUTENAME = '[a-zA-Z_:][a-zA-Z0-9_.:-]*'
const UNQUOTEDVALUE = '[^"\'=<>`\\x00-\\x20]+'
const SINGLEQUOTEDVALUE = "'[^']*'"
const DOUBLEQUOTEDVALUE = '"[^"]*"'
const ATTRIBUTEVALUE = '(?:' + UNQUOTEDVALUE + '|' + SINGLEQUOTEDVALUE + '|' + DOUBLEQUOTEDVALUE + ')'
const ATTRIBUTEVALUESPEC = '(?:\\s*=\\s*' + ATTRIBUTEVALUE + ')'
const ATTRIBUTE = '(?:\\s+' + ATTRIBUTENAME + ATTRIBUTEVALUESPEC + '?)'
export const OPENTAG = '<' + TAGNAME + ATTRIBUTE + '*\\s*/?>'
export const CLOSETAG = '</' + TAGNAME + '\\s*[>]'
const HTMLCOMMENT = '<!-->|<!--->|<!--[\\s\\S]*?-->'
const PROCESSINGINSTRUCTION = '[<][?][\\s\\S]*?[?][>]'
const DECLARATION = '<![A-Za-z]+[^>]*>'
const CDATA = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>'
export const reHtmlTag = new RegExp(
  '^(?:' + OPENTAG + '|' + CLOSETAG + '|' + HTMLCOMMENT + '|' + PROCESSINGINSTRUCTION + '|' + DECLARATION + '|' + CDATA + ')',
  'i',
)
