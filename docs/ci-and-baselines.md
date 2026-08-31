# CI and Baselines

## Greenfield project

Run serious findings as a CI gate immediately:

```bash
node ./bin/cli.mjs scan . --ci
```

## Existing project

First record current debt:

```bash
node ./bin/cli.mjs baseline create .
```

Commit `.ui-audit-baseline.json`.

Then CI evaluates only newly introduced fingerprints:

```bash
node ./bin/cli.mjs scan . --baseline --ci
```

This supports a ratchet strategy: new code cannot worsen the project while the team fixes historical findings over time.

## GitHub Actions

The kit includes `.github/workflows/ui-audit.yml`.

A practical production workflow can additionally upload the HTML or JSON report as a build artifact.
