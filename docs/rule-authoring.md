# Rule Authoring Guide

## Rule anatomy

```js
{
  id: "a11y.clickable-div",
  category: "accessibility",
  severity: "high",
  confidence: 91,
  title: "Clickable div without native button semantics",
  regex: /.../,
  description: "Why this pattern matters.",
  suggestion: "What direction to take.",
  bad: "<div onClick={...}>Open</div>",
  good: "<button type=\"button\" onClick={...}>Open</button>"
}
```

## Stable IDs

Rule IDs are API. Do not rename them casually because baselines, configuration and external integrations can depend on them.

## Severity discipline

Do not make a visual preference critical. Severity should represent potential user or engineering impact.

## Confidence discipline

Ask how much context the detector actually knows. A regex that finds `width: 100vw` does not know whether viewport width is intentional, so confidence should remain moderate.

## False positives

Every new rule should include at least one test where similar but valid code is not reported.

## Explanations

A rule should teach. Avoid vague messages like `bad pattern detected`.

Good explanations connect source code to behavior:

```text
Random React keys change identity on every render, which can remount children,
lose local state and create unnecessary DOM work.
```
