#!/usr/bin/env python3
"""Builds vectors/lombokmarkdown-vectors-v1.json (GP-11).

These vectors cover behaviour that the CommonMark and GFM spec suites do not:
safe defaults (raw HTML escaped, unsafe URLs dropped), options, heading ids,
table of contents, metadata and the public AST. Every expected value is written
by hand from SPEC_LombokMarkDown, never copied from implementation output.
Conformance to CommonMark 0.31.2 and GFM 0.29 is tested separately against the
official examples (tests/spec.test.ts).

After editing, run:

    python3 vectors/build_vectors.py
    sha256sum vectors/lombokmarkdown-vectors-v1.json > vectors/SHA256SUMS

and update the hash in docs/SPEC_LombokMarkDown_v<version>.md.
"""
import json
import pathlib

cases = []


def add(fn, input, expected, options=None, note=None):
    case = {"id": f"{fn}-{sum(1 for c in cases if c['fn'] == fn) + 1:03d}", "fn": fn, "input": input}
    if options:
        case["options"] = options
    if note:
        case["note"] = note
    case["expected"] = expected
    cases.append(case)


# --- §3 HTML with default options (gfm, safe) --------------------------------
H = "html"
add(H, "", "")
add(H, "Hello", "<p>Hello</p>\n")
add(H, "# Judul\n\nParagraf **tebal** dan *miring*.", "<h1>Judul</h1>\n<p>Paragraf <strong>tebal</strong> dan <em>miring</em>.</p>\n")
add(H, "a\nb", "<p>a\nb</p>\n")
add(H, "a\nb", "<p>a<br />\nb</p>\n", {"breaks": True})
add(H, "a  \nb", "<p>a<br />\nb</p>\n")
add(H, "a\\\nb", "<p>a<br />\nb</p>\n")
add(H, "<b>bold</b>", "<p>&lt;b&gt;bold&lt;/b&gt;</p>\n", note="raw inline HTML escaped by default")
add(H, "<b>bold</b>", "<p><b>bold</b></p>\n", {"html": True})
add(H, "<div>\nblock\n</div>", "<p>&lt;div&gt;\nblock\n&lt;/div&gt;</p>\n", note="raw HTML block escaped by default")
add(H, "<div>\nblock\n</div>", "<div>\nblock\n</div>\n", {"html": True})
add(H, "<script>alert(1)</script>", "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>\n")
add(H, "<script>alert(1)</script>", "&lt;script>alert(1)&lt;/script>\n", {"html": True}, note="GFM tag filter")
add(H, "<script>alert(1)</script>", "<script>alert(1)</script>\n", {"html": True, "gfm": False}, note="no tag filter without GFM")
add(H, "x <iframe src=a> y", "<p>x &lt;iframe src=a> y</p>\n", {"html": True})
add(H, "x <IFRAME> y", "<p>x &lt;IFRAME> y</p>\n", {"html": True}, note="tag filter is case-insensitive")
add(H, "<!-- c -->", "<p>&lt;!-- c --&gt;</p>\n")
add(H, "[a](javascript:alert(1))", '<p><a href="">a</a></p>\n')
add(H, "[a](JaVaScRiPt:alert(1))", '<p><a href="">a</a></p>\n')
add(H, "[a](vbscript:x)", '<p><a href="">a</a></p>\n')
add(H, "[a](file:///etc/passwd)", '<p><a href="">a</a></p>\n')
add(H, "[a](data:text/html;base64,PHA+)", '<p><a href="">a</a></p>\n')
add(H, "![a](data:image/png;base64,iVBO)", '<p><img src="data:image/png;base64,iVBO" alt="a" /></p>\n')
add(H, "![a](data:image/svg+xml;base64,PHN2Zz4=)", '<p><img src="" alt="a" /></p>\n', note="SVG data URI is unsafe")
add(H, "[a](javascript:alert(1))", '<p><a href="javascript:alert(1)">a</a></p>\n', {"safeLinks": False})
add(H, "<javascript:alert(1)>", '<p><a href="">javascript:alert(1)</a></p>\n', note="autolink with unsafe scheme")
add(H, "[a](https://example.com/?q=1&x=2 \"T\")", '<p><a href="https://example.com/?q=1&amp;x=2" title="T">a</a></p>\n')
add(H, "[a](<b c>)", '<p><a href="b%20c">a</a></p>\n')
add(H, "[a](/ä)", '<p><a href="/%C3%A4">a</a></p>\n')
add(H, "[x]\n\n[x]: /url 'judul'", '<p><a href="/url" title="judul">x</a></p>\n')
add(H, "[X]\n\n[x]: /url", '<p><a href="/url">X</a></p>\n', note="labels are case-insensitive")
add(H, "&copy; &#169; &#xA9; &bogus;", "<p>© © © &amp;bogus;</p>\n")
add(H, "a & b < c > d \" e", "<p>a &amp; b &lt; c &gt; d &quot; e</p>\n")
add(H, "\\*tidak miring\\*", "<p>*tidak miring*</p>\n")
add(H, "`kode <b>`", "<p><code>kode &lt;b&gt;</code></p>\n")
add(H, "```js\nconst a = 1 < 2\n```", '<pre><code class="language-js">const a = 1 &lt; 2\n</code></pre>\n')
add(H, "```\nplain\n```", "<pre><code>plain\n</code></pre>\n")
add(H, "    indented", "<pre><code>indented\n</code></pre>\n")
add(H, "> kutipan\n> dua", "<blockquote>\n<p>kutipan\ndua</p>\n</blockquote>\n")
add(H, "---", "<hr />\n")
add(H, "- a\n- b", "<ul>\n<li>a</li>\n<li>b</li>\n</ul>\n")
add(H, "- a\n\n- b", "<ul>\n<li>\n<p>a</p>\n</li>\n<li>\n<p>b</p>\n</li>\n</ul>\n")
add(H, "1. a\n2. b", "<ol>\n<li>a</li>\n<li>b</li>\n</ol>\n")
add(H, "3. a\n4. b", '<ol start="3">\n<li>a</li>\n<li>b</li>\n</ol>\n')
add(H, "- a\n  - b", "<ul>\n<li>a\n<ul>\n<li>b</li>\n</ul>\n</li>\n</ul>\n")
add(H, "- [ ] todo\n- [x] done", '<ul>\n<li><input disabled="" type="checkbox"> todo</li>\n<li><input checked="" disabled="" type="checkbox"> done</li>\n</ul>\n')
add(H, "- [X] upper", '<ul>\n<li><input checked="" disabled="" type="checkbox"> upper</li>\n</ul>\n')
add(H, "- [ ] todo", "<ul>\n<li>[ ] todo</li>\n</ul>\n", {"gfm": False})
add(H, "- [ ]", "<ul>\n<li>[ ]</li>\n</ul>\n", note="task marker needs content")
add(H, "~~hapus~~ ~juga~", "<p><del>hapus</del> <del>juga</del></p>\n")
add(H, "~~~x~~~", "<pre><code class=\"language-x~~~\"></code></pre>\n", note="three tildes open a fenced code block")
add(H, "a ~~~b~~~ c", "<p>a ~~~b~~~ c</p>\n", note="three-tilde runs are not strikethrough")
add(H, "~~hapus~~", "<p>~~hapus~~</p>\n", {"gfm": False})
add(H, "| a | b |\n| :- | -: |\n| 1 | 2 |",
    '<table>\n<thead>\n<tr>\n<th align="left">a</th>\n<th align="right">b</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align="left">1</td>\n<td align="right">2</td>\n</tr>\n</tbody>\n</table>\n')
add(H, "| a |\n| :-: |", '<table>\n<thead>\n<tr>\n<th align="center">a</th>\n</tr>\n</thead>\n</table>\n')
add(H, "| a | b |\n| - | - |\n| <x> | **y** |",
    "<table>\n<thead>\n<tr>\n<th>a</th>\n<th>b</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>&lt;x&gt;</td>\n<td><strong>y</strong></td>\n</tr>\n</tbody>\n</table>\n")
add(H, "teks\n| a |\n| - |", "<p>teks</p>\n<table>\n<thead>\n<tr>\n<th>a</th>\n</tr>\n</thead>\n</table>\n",
    note="header row is the last line of a paragraph")
add(H, "| a | b |\n| - |", "<p>| a | b |\n| - |</p>\n", note="cell count mismatch: not a table")
add(H, "| a |\n| - |", "<p>| a |\n| - |</p>\n", {"gfm": False})
add(H, "www.example.com", '<p><a href="http://www.example.com">www.example.com</a></p>\n')
add(H, "lihat https://example.com/a.", '<p>lihat <a href="https://example.com/a">https://example.com/a</a>.</p>\n')
add(H, "surat: nama@example.org", '<p>surat: <a href="mailto:nama@example.org">nama@example.org</a></p>\n')
add(H, "www.example.com", "<p>www.example.com</p>\n", {"gfm": False})
add(H, "[www.example.com](/x)", '<p><a href="/x">www.example.com</a></p>\n', note="no autolink inside links")
add(H, "`www.example.com`", "<p><code>www.example.com</code></p>\n")
add(H, "# A\n## B", '<h1 id="a">A</h1>\n<h2 id="b">B</h2>\n', {"headingIds": True})
add(H, "# Halo Dunia!\n# Halo Dunia!\n# Halo Dunia!", '<h1 id="halo-dunia">Halo Dunia!</h1>\n<h1 id="halo-dunia-1">Halo Dunia!</h1>\n<h1 id="halo-dunia-2">Halo Dunia!</h1>\n',
    {"headingIds": True})
add(H, "# Ringkasan *Eksekutif*", '<h1 id="ringkasan-eksekutif">Ringkasan <em>Eksekutif</em></h1>\n', {"headingIds": True})
add(H, "# Café 日本 2026", '<h1 id="café-日本-2026">Café 日本 2026</h1>\n', {"headingIds": True})
add(H, "# a_b-c d", '<h1 id="a_b-c-d">a_b-c d</h1>\n', {"headingIds": True})
add(H, "# \"Quote\" & <tag>", '<h1 id="quote--">&quot;Quote&quot; &amp; &lt;tag&gt;</h1>\n', {"headingIds": True},
    note="raw HTML is not part of the heading text used for the slug")
add(H, "# x\n# x-1\n# x", '<h1 id="x">x</h1>\n<h1 id="x-1">x-1</h1>\n<h1 id="x-2">x</h1>\n', {"headingIds": True},
    note="a generated suffix never collides with an existing slug")
add(H, "Judul\n=====", "<h1>Judul</h1>\n")
add(H, "a\u0000b", "<p>a�b</p>\n", note="NUL replaced")
add(H, "é́ 😀", "<p>é́ 😀</p>\n")
add(H, "*a **b** c*", "<p><em>a <strong>b</strong> c</em></p>\n")
add(H, "**unclosed", "<p>**unclosed</p>\n")
add(H, "*", "<ul>\n<li></li>\n</ul>\n")
add(H, "![gambar *alt*](/i.png \"t\")", '<p><img src="/i.png" alt="gambar alt" title="t" /></p>\n')

# --- §4 metadata -------------------------------------------------------------
M = "metadata"
add(M, "", {"headings": [], "links": [], "images": [], "codeBlocks": []})
add(M, "# Satu\n## Dua *tiga*\n### `kode`", {"headings": [{"level": 1, "text": "Satu"}, {"level": 2, "text": "Dua tiga"}, {"level": 3, "text": "kode"}],
                                         "links": [], "images": [], "codeBlocks": []})
add(M, "[a](/x) [b **c**](/y \"T\")", {"headings": [], "links": [{"text": "a", "url": "/x"}, {"text": "b c", "url": "/y", "title": "T"}],
                                       "images": [], "codeBlocks": []})
add(M, "![a](/i.png) ![](/j.png \"J\")", {"headings": [], "links": [], "images": [{"alt": "a", "src": "/i.png"}, {"alt": "", "src": "/j.png", "title": "J"}],
                                          "codeBlocks": []})
add(M, "```py title\nprint(1)\n```\n\n    x\n    y", {"headings": [], "links": [], "images": [],
                                                    "codeBlocks": [{"lang": "py", "code": "print(1)"}, {"code": "x\ny"}]})
add(M, "<https://a.example> www.b.example", {"headings": [], "links": [{"text": "https://a.example", "url": "https://a.example"},
                                                                      {"text": "www.b.example", "url": "http://www.b.example"}],
                                             "images": [], "codeBlocks": []})
add(M, "[x](javascript:alert(1))", {"headings": [], "links": [{"text": "x", "url": ""}], "images": [], "codeBlocks": []})
add(M, "[x](javascript:alert(1))", {"headings": [], "links": [{"text": "x", "url": "javascript:alert(1)"}], "images": [], "codeBlocks": []},
    {"safeLinks": False})
add(M, "[![logo](/l.png)](/home)", {"headings": [], "links": [{"text": "logo", "url": "/home"}], "images": [{"alt": "logo", "src": "/l.png"}],
                                    "codeBlocks": []})
add(M, "> # Dalam kutipan\n- ## Dalam daftar", {"headings": [{"level": 1, "text": "Dalam kutipan"}, {"level": 2, "text": "Dalam daftar"}],
                                               "links": [], "images": [], "codeBlocks": []})
add(M, "Judul\n---", {"headings": [{"level": 2, "text": "Judul"}], "links": [], "images": [], "codeBlocks": []})

# --- §5 table of contents ------------------------------------------------------
T = "toc"


def e(level, text, id, *children):
    return {"level": level, "text": text, "id": id, "children": list(children)}


add(T, "", [])
add(T, "# A\n## B\n## C\n# D", [e(1, "A", "a", e(2, "B", "b"), e(2, "C", "c")), e(1, "D", "d")])
add(T, "## A\n# B\n### C", [e(2, "A", "a"), e(1, "B", "b", e(3, "C", "c"))])
add(T, "# A\n### B\n## C", [e(1, "A", "a", e(3, "B", "b"), e(2, "C", "c"))])
add(T, "# Sama\n## Sama\n# Sama", [e(1, "Sama", "sama", e(2, "Sama", "sama-1")), e(1, "Sama", "sama-2")])
add(T, "### Hanya tiga", [e(3, "Hanya tiga", "hanya-tiga")])
add(T, "# Langkah 1: Instalasi", [e(1, "Langkah 1: Instalasi", "langkah-1-instalasi")])

# --- §6 AST ------------------------------------------------------------------
A = "ast"
add(A, "", [])
add(A, "Hi *you*", [{"type": "paragraph", "children": [{"type": "text", "value": "Hi "}, {"type": "emphasis", "children": [{"type": "text", "value": "you"}]}]}])
add(A, "## T", [{"type": "heading", "depth": 2, "children": [{"type": "text", "value": "T"}]}])
add(A, "```js x\ncode\n```", [{"type": "codeBlock", "value": "code\n", "lang": "js", "meta": "js x"}])
add(A, "---", [{"type": "thematicBreak"}])
add(A, "- a\n- [x] b", [{"type": "list", "ordered": False, "loose": False, "children": [
    {"type": "listItem", "children": [{"type": "paragraph", "children": [{"type": "text", "value": "a"}]}]},
    {"type": "listItem", "checked": True, "children": [{"type": "paragraph", "children": [{"type": "text", "value": "b"}]}]}]}])
add(A, "2. a\n\n3. b", [{"type": "list", "ordered": True, "loose": True, "start": 2, "children": [
    {"type": "listItem", "children": [{"type": "paragraph", "children": [{"type": "text", "value": "a"}]}]},
    {"type": "listItem", "children": [{"type": "paragraph", "children": [{"type": "text", "value": "b"}]}]}]}])
add(A, "> q", [{"type": "blockquote", "children": [{"type": "paragraph", "children": [{"type": "text", "value": "q"}]}]}])
add(A, "a\nb  \nc", [{"type": "paragraph", "children": [{"type": "text", "value": "a"}, {"type": "softBreak"}, {"type": "text", "value": "b"},
                                                       {"type": "lineBreak"}, {"type": "text", "value": "c"}]}])
add(A, "[l](/u \"t\") ![i](/p)", [{"type": "paragraph", "children": [
    {"type": "link", "href": "/u", "title": "t", "children": [{"type": "text", "value": "l"}]},
    {"type": "text", "value": " "},
    {"type": "image", "href": "/p", "alt": "i"}]}])
add(A, "`c` ~~d~~ **s**", [{"type": "paragraph", "children": [
    {"type": "code", "value": "c", "inline": True}, {"type": "text", "value": " "},
    {"type": "delete", "children": [{"type": "text", "value": "d"}]}, {"type": "text", "value": " "},
    {"type": "strong", "children": [{"type": "text", "value": "s"}]}]}])
add(A, "| h |\n| :- |\n| v |", [{"type": "table", "children": [
    {"type": "tableRow", "header": True, "children": [{"type": "tableCell", "header": True, "align": "left", "children": [{"type": "text", "value": "h"}]}]},
    {"type": "tableRow", "header": False, "children": [{"type": "tableCell", "header": False, "align": "left", "children": [{"type": "text", "value": "v"}]}]}]}])
add(A, "<div>x</div>\n\n<b>y</b>", [{"type": "html", "value": "<div>x</div>"},
                                    {"type": "paragraph", "children": [{"type": "html", "value": "<b>", "inline": True}, {"type": "text", "value": "y"},
                                                                       {"type": "html", "value": "</b>", "inline": True}]}])
add(A, "[x](javascript:alert(1))", [{"type": "paragraph", "children": [{"type": "link", "href": "", "children": [{"type": "text", "value": "x"}]}]}])
add(A, "[x]: /u\n\n[x]", [{"type": "paragraph", "children": [{"type": "link", "href": "/u", "children": [{"type": "text", "value": "x"}]}]}],
    note="reference definitions leave no node")
add(A, "a &amp; b", [{"type": "paragraph", "children": [{"type": "text", "value": "a "}, {"type": "text", "value": "&"}, {"type": "text", "value": " b"}]}],
    {"gfm": False}, note="without GFM adjacent text nodes are not merged")
add(A, "a &amp; b", [{"type": "paragraph", "children": [{"type": "text", "value": "a & b"}]}], note="with GFM adjacent text nodes are merged")

doc = {
    "name": "lombokmarkdown-vectors",
    "version": 1,
    "spec": "docs/SPEC_LombokMarkDown (sections 3-6)",
    "functions": {
        "html": "new Markdown(input, options).getHTML()",
        "metadata": "new Markdown(input, options).getMetadata()",
        "toc": "new Markdown(input, options).getTableOfContents()",
        "ast": "new Markdown(input, options).getAST()",
    },
    "compare": "canonical JSON with object keys sorted",
    "cases": cases,
}
out = pathlib.Path(__file__).with_name("lombokmarkdown-vectors-v1.json")
out.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"{len(cases)} cases -> {out}")
