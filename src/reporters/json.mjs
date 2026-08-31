export function jsonReport(audit) {
  return `${JSON.stringify({
    project: audit.project,
    summary: audit.summary,
    score: audit.score,
    findings: audit.findings
  }, null, 2)}\n`;
}
