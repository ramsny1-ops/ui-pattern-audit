export const SEVERITY_WEIGHT = {
  info: 0.25,
  warning: 1,
  high: 3,
  critical: 7
};

export function scoreAudit(findings, scannedFiles) {
  const categories = new Map();
  for (const finding of findings) {
    const current = categories.get(finding.category) ?? { penalty: 0, count: 0 };
    current.penalty += SEVERITY_WEIGHT[finding.severity] * (finding.confidence / 100);
    current.count += 1;
    categories.set(finding.category, current);
  }

  const normalization = Math.max(1, Math.sqrt(Math.max(1, scannedFiles)) * 2.8);
  const categoryScores = {};
  for (const [category, data] of categories) {
    categoryScores[category] = Math.max(0, Math.round(100 - (data.penalty / normalization) * 12));
  }

  const totalPenalty = findings.reduce(
    (sum, f) => sum + SEVERITY_WEIGHT[f.severity] * (f.confidence / 100),
    0
  );
  const overall = Math.max(0, Math.round(100 - (totalPenalty / normalization) * 6));
  return { overall, categoryScores };
}
