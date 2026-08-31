# UI Pattern Audit Pro

A zero-runtime-dependency frontend quality audit CLI for detecting visual boilerplate, over-engineered motion, accessibility hazards, responsive layout risks, fragile state patterns, performance smells, security sinks and maintainability drift.

This project grew from a 60-pattern UI anti-pattern field guide into a reusable auditing kit. It is deliberately heuristic: it points reviewers to suspicious code and explains the reasoning. It does not pretend that every match is automatically a defect.

## Why this exists

Traditional linters are excellent at syntax, correctness rules and framework conventions. They are less useful for questions such as:

- Is this React key stable across renders?
- Does this product have four competing z-index scales?
- Are important actions visible only on hover?
- Does the project animate heavily without reduced-motion support?
- Are fixed widths likely to break mobile layouts?
- Are forms missing browser and password-manager metadata?
- Is the design system drifting into one-off spacing and radii?
- Is a UI relying on the same visual defaults used by thousands of templates?

UI Pattern Audit Pro turns those questions into named, explainable review rules.

## Run it immediately

Requirements: Node.js 20 or newer.

```bash
node ./bin/cli.mjs scan ./examples/broken
```

Scan your own project:

```bash
node ./bin/cli.mjs scan /path/to/project
```

Generate a standalone HTML report:

```bash
node ./bin/cli.mjs scan /path/to/project \
  --format html \
  --out ui-audit-report.html
```

## CLI commands

```text
ui-audit scan [path]
ui-audit rules
ui-audit explain <rule-id>
ui-audit init [path]
ui-audit baseline create [path]
ui-audit doctor [path]
```

### Scan only serious findings

```bash
node ./bin/cli.mjs scan . --severity high
```

### JSON for tooling

```bash
node ./bin/cli.mjs scan . --format json --out audit.json
```

### Markdown for pull requests

```bash
node ./bin/cli.mjs scan . --format markdown --out audit.md
```

### CI mode

```bash
node ./bin/cli.mjs scan . --ci
```

`--ci` exits with status code 2 when a `high` or `critical` finding exists.

Override the threshold:

```bash
node ./bin/cli.mjs scan . --fail-on critical
```

Or never fail:

```bash
node ./bin/cli.mjs scan . --fail-on never
```

## Baselines for existing codebases

A legacy project may already contain hundreds of warnings. Do not make adoption impossible.

Record current findings:

```bash
node ./bin/cli.mjs baseline create .
```

This creates:

```text
.ui-audit-baseline.json
```

Then scan only newly introduced findings:

```bash
node ./bin/cli.mjs scan . --baseline --ci
```

That makes the tool suitable for gradual cleanup.

## Explainable rules

Every finding has a stable ID.

```bash
node ./bin/cli.mjs explain react.random-key
```

Example concept:

```jsx
items.map((item) => (
  <Card key={Math.random()} item={item} />
))
```

Why it is dangerous:

React uses keys to associate rendered children with stable identity. A random value changes on every render. React therefore sees a different component, can unmount the previous instance and can lose local state, focus and animation continuity.

Better:

```jsx
items.map((item) => (
  <Card key={item.id} item={item} />
))
```

## Severity is not the same as confidence

Two separate dimensions are reported.

Severity answers:

> If this is a real defect, how damaging could it be?

Confidence answers:

> Based only on static source evidence, how likely is this match to represent the described pattern?

Example:

```text
CRITICAL
react.random-key
confidence 99%
```

versus:

```text
INFO
visual.em-dash-density
confidence 55%
```

The first is a strong code-level defect signal. The second is intentionally a soft editorial review signal.

## Categories

Current rule families include:

- visual-design
- motion
- accessibility
- performance
- functional
- maintainability
- responsive
- forms
- security

Category scores make it possible for a project to be strong in state correctness but weak in accessibility or responsive design.

## Framework fingerprinting

The scanner reads `package.json` when available and reports signals such as:

```text
Framework: React
Styling: Tailwind CSS
Animation libraries: framer-motion, gsap
Icon libraries: lucide-react, react-icons
```

That enables project-level findings such as multiple animation systems or multiple icon families.

## Project-level analysis

Some smells cannot be understood one line at a time.

For example, these values may each look harmless in isolation:

```css
.header { z-index: 100; }
.dropdown { z-index: 999; }
.modal { z-index: 9999; }
.toast { z-index: 99999; }
```

Together they indicate stacking escalation. The project rule reports a z-index map signal and recommends a controlled layer scale.

The same idea is used for:

- reduced-motion coverage
- animation library proliferation
- icon library proliferation
- spacing-token drift

## Configuration

Create a starter config:

```bash
node ./bin/cli.mjs init .
```

Example:

```json
{
  "extends": "recommended",
  "ignore": ["public/vendor"],
  "rules": {
    "visual.gradient-text": "off",
    "maintainability.console-log": "warn",
    "react.random-key": "critical"
  }
}
```

Supported rule values:

```text
off
info
warn
warning
error
high
critical
```

## Inline suppression

Suppress a deliberate exception instead of disabling a rule globally.

```js
// ui-audit-disable-next-line visual.gradient-text
const heroClass = "bg-clip-text text-transparent";
```

Or near the top of a file:

```js
// ui-audit-disable visual.gradient-text
```

Use suppression as documentation, not as a way to silence unexplained debt.

## Output formats

### Terminal

Best for local development.

```bash
node ./bin/cli.mjs scan .
```

### JSON

Best for editor integrations, dashboards and custom automation.

```bash
node ./bin/cli.mjs scan . --format json
```

### Markdown

Best for pull-request comments and audit notes.

```bash
node ./bin/cli.mjs scan . --format markdown
```

### HTML

Best for human review and sharing with a team.

```bash
node ./bin/cli.mjs scan . --format html --out report.html
```

The HTML report contains severity counts, category scores, source locations, explanations and risky/better code examples.

## Example output

```text
UI Pattern Audit Pro
====================
Project: broken-ui-demo
Framework: React
Styling: Tailwind CSS
Scanned files: 4
Overall score: 41/100

[CRITICAL] react.random-key
Unstable React key generated during render | confidence 99%
  App.jsx:24
  <article key={Math.random()} ...>
  Why: Keys must describe stable identity...
  Better: Use a durable entity ID...
```

## Architecture

```text
Filesystem discovery
        |
        v
Project fingerprint
        |
        v
Source file model
        |
        +--------------------+
        |                    |
        v                    v
Line rules              File rules
        |                    |
        +----------+---------+
                   |
                   v
             Project rules
                   |
                   v
          Severity + confidence
                   |
                   v
              Score engine
                   |
      +------------+------------+
      |            |            |
      v            v            v
  Terminal        JSON       HTML/Markdown
```

The code is intentionally split so future AST parsers can replace or supplement heuristic matchers without changing reporting, configuration or CI behavior.

## Smart rule philosophy

A strong rule should satisfy four questions.

### 1. Can we identify a concrete fingerprint?

Weak:

```text
This UI feels AI-generated.
```

Stronger:

```text
The project contains repeated gradient-clipped headings, translucent blur cards,
large arbitrary z-index values and a uniform icon-box section pattern.
```

### 2. Can we explain the actual risk?

Do not say:

```text
Glassmorphism is bad.
```

Say:

```text
Heavy translucent blur can reduce text contrast, add compositing cost and make
layer hierarchy ambiguous when every surface uses the same effect.
```

### 3. Can we represent uncertainty?

A hero image without `loading="lazy"` may be correct. Therefore that rule is informational and low-confidence.

A React key built from `Math.random()` is almost always wrong. Therefore that rule is critical and high-confidence.

### 4. Can we recommend direction instead of blindly rewriting?

A static scanner cannot know every product requirement. Recommendations should make the engineering decision clearer, not pretend context does not exist.

## Included kit

```text
ui-pattern-audit-pro/
├── bin/
│   └── cli.mjs
├── src/
│   ├── cli.mjs
│   ├── core/
│   │   ├── config.mjs
│   │   ├── engine.mjs
│   │   ├── fingerprint.mjs
│   │   ├── project.mjs
│   │   └── score.mjs
│   ├── reporters/
│   │   ├── html.mjs
│   │   ├── json.mjs
│   │   ├── markdown.mjs
│   │   └── terminal.mjs
│   ├── rules/
│   │   └── index.mjs
│   └── utils/
│       └── files.mjs
├── docs/
│   ├── original-60-pattern-field-guide.md
│   ├── architecture.md
│   ├── ci-and-baselines.md
│   ├── rule-authoring.md
│   ├── scoring.md
│   └── rule-catalog.md
├── examples/
│   ├── broken/
│   └── clean/
├── test/
├── .github/workflows/
├── .ui-auditrc.example.json
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
└── package.json
```

## Test the kit

```bash
npm test
```

Test the deliberately broken project:

```bash
npm run demo:bad
```

Test the cleaner example:

```bash
npm run demo:clean
```

Generate the demonstration report:

```bash
npm run report
```

## What this version deliberately does not pretend to do

The current engine is context-aware at file and project level but is not yet a complete JavaScript, CSS or template AST analyzer. Regex and structural heuristics are excellent for recognizable fingerprints, but deeper semantic questions require parsers and control-flow analysis.

The architecture is prepared for that next stage. An AST adapter can later provide facts such as:

```text
this Math.random call is specifically inside a JSX key
this fetch occurs inside useEffect
this state setter updates a dependency watched by the same effect
this button is reachable only through hover state
this CSS declaration wins after cascade resolution
```

That is the route from a powerful heuristic auditor to a compiler-grade frontend quality platform.
