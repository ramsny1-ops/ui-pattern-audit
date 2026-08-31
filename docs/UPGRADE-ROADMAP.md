# Semantic Upgrade Roadmap

The current edition is a strong heuristic engine. The next major generation should preserve the finding contract while adding parser-backed facts.

## Tier 1: parser adapters

- JavaScript and TypeScript AST adapter
- JSX relationship analysis
- CSS AST and cascade-aware facts
- HTML DOM tree analysis
- Vue SFC adapter
- Svelte compiler adapter
- Astro compiler adapter

## Tier 2: data-flow intelligence

- distinguish Math.random in business logic from Math.random in JSX identity
- map React effect dependencies to setters and reads
- detect optimistic updates and whether rollback exists
- find duplicate network requests across parent and child components
- identify stale closure candidates
- classify derived state
- trace user input from control to validation and network submission

## Tier 3: structural UI intelligence

- component complexity metrics
- prop count and prop drilling graph
- JSX depth
- hook count
- event handler count
- modal ownership graph
- route graph and dead-link detection
- z-index layer map with stacking-context awareness
- repeated Tailwind composition extraction candidates

## Tier 4: asset intelligence

- image byte size and decoded dimensions
- responsive image coverage
- SVG complexity
- duplicate asset hashing
- route-level asset budgets
- LCP candidate detection
- font family and weight payload analysis

## Tier 5: integration

- SARIF output for GitHub code scanning
- editor diagnostics
- pre-commit mode
- changed-file mode
- PR annotations
- historical trend database
- organization rule presets
- plugin API for custom rules

The goal is not to produce more warnings. The goal is to increase semantic certainty while reducing false positives.
