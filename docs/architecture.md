# Architecture

## Design goals

UI Pattern Audit Pro separates detection from explanation and reporting. This matters because detector technology will evolve. A regex rule, HTML parser, CSS AST, JavaScript AST or framework-specific analyzer should all be able to emit the same finding contract.

## Finding contract

Every finding contains:

```js
{
  ruleId,
  category,
  severity,
  confidence,
  title,
  description,
  suggestion,
  file,
  line,
  snippet,
  bad,
  good,
  fingerprint
}
```

Stable fingerprints allow baseline comparison.

## Detection layers

### Line rules

Fast fingerprint matching for local patterns such as `console.log`, `dangerouslySetInnerHTML`, arbitrary z-index utilities or missing HTML attributes.

### File rules

Analyze relationships within one file, including large components and effect patterns.

### Project rules

Combine facts from multiple files and package metadata. Examples include dependency proliferation, z-index escalation, spacing drift and project-level reduced-motion coverage.

## Why zero runtime dependencies

This edition deliberately runs with only Node.js built-ins. That gives the kit an immediate, inspectable baseline and avoids making installation a prerequisite for testing the architecture.

The next semantic tier should add parser adapters behind a stable interface rather than coupling the entire application to one parser.

Suggested future adapters:

```text
JavaScript and TypeScript: Babel parser or TypeScript compiler API
CSS: PostCSS parser
HTML: parse5
Vue: @vue/compiler-sfc
Svelte: svelte/compiler
Astro: @astrojs/compiler
```
