# Contributing

## Rule design principles

A useful rule must identify a concrete code fingerprint, explain why the fingerprint can matter, communicate uncertainty, and recommend a direction rather than blindly rewriting user code.

Each rule should include:

- stable ID
- category
- default severity
- confidence estimate
- concise title
- technical explanation
- actionable recommendation
- risky example
- better example
- test fixture

Avoid rules that merely enforce personal aesthetic preference. A visual-style rule should default to `info` unless it creates a measurable usability, accessibility, performance, or maintenance risk.

## Development

```bash
npm test
npm run demo:bad
node ./bin/cli.mjs rules
```

Add tests for both positive detection and important false-positive cases.
