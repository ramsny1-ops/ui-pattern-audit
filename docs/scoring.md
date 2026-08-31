# Scoring and Confidence

The score is a review heuristic, not a certification.

Severity weights are intentionally nonlinear:

```text
info      0.25
warning   1
high      3
critical  7
```

Each penalty is multiplied by confidence. A low-confidence informational finding therefore has very little effect on the score, while a high-confidence critical finding has a significant effect.

Project size is normalized approximately by the square root of scanned file count so a large codebase is not punished linearly simply for containing more files.

## Severity

### Info

Style or maintainability signal that deserves awareness but should rarely block delivery.

### Warning

Likely quality issue with measurable UX, consistency or engineering impact.

### High

Strong defect or accessibility/performance risk that deserves active review.

### Critical

Potentially severe behavior such as unstable component identity, navigation traps, leaked secrets or render loops.

## Confidence

Confidence reflects detector certainty, not impact.

Examples:

```text
react.random-key                    99%
performance.image-missing-dimensions 87%
visual.em-dash-density              55%
```

The last rule is intentionally soft because punctuation alone cannot establish poor copy quality.
