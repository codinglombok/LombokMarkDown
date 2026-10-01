# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| 2.0.x | Yes |
| 1.x and older | No (1.x rendered `javascript:` links as clickable `href` values) |

## Reporting a vulnerability

Please report vulnerabilities privately through GitHub Security Advisories:
<https://github.com/codinglombok/LombokMarkDown/security/advisories/new>.
Do not open a public issue. You should receive an acknowledgement within 3 working days and a fix or mitigation plan within 30 days.

## Scope and threat model

LombokMarkDown renders untrusted Markdown. The guarantees are normative in [SPEC section 7](docs/SPEC_LombokMarkDown_v2.0.0.md#7-keamanan-normatif):

- by default raw HTML is escaped and `javascript:`, `vbscript:`, `file:`, and non-image `data:` URLs are emptied;
- all text and attribute values are escaped and URLs are percent-encoded;
- parsing runs without input-dependent recursion and stays near-linear on adversarial input (`tests/pathological.test.ts`).

Out of scope: output produced with `html: true` or `safeLinks: false` for untrusted input (use a sanitizer such as LombokHTML), and inserting the HTML inside `<script>`, `<style>`, or attribute values.
