# Quick Start

## 1. Verify the kit

```bash
node --version
npm test
```

Node.js 20 or newer is recommended.

## 2. Scan the deliberately broken sample

```bash
node ./bin/cli.mjs scan ./examples/broken
```

## 3. Scan a real frontend project

```bash
node ./bin/cli.mjs scan /absolute/path/to/project
```

## 4. Show only serious issues

```bash
node ./bin/cli.mjs scan /absolute/path/to/project --severity high
```

## 5. Generate a readable report

```bash
node ./bin/cli.mjs scan /absolute/path/to/project \
  --format html \
  --out ui-audit-report.html
```

## 6. Ask why a rule exists

```bash
node ./bin/cli.mjs explain react.random-key
```

## 7. Configure exceptions

```bash
node ./bin/cli.mjs init /absolute/path/to/project
```

Edit `.ui-auditrc.json`.

## 8. Adopt it in an existing project without failing on old debt

```bash
node ./bin/cli.mjs baseline create /absolute/path/to/project
node ./bin/cli.mjs scan /absolute/path/to/project --baseline --ci
```
