const icon = {
  critical: "CRITICAL",
  high: "HIGH",
  warning: "WARN",
  info: "INFO"
};

export function terminalReport(audit) {
  const out = [];
  out.push("UI Pattern Audit Pro");
  out.push("====================");
  out.push(`Project: ${audit.project.packageName ?? "unnamed"}`);
  out.push(`Framework: ${audit.project.framework}`);
  out.push(`Styling: ${audit.project.styling}`);
  out.push(`Scanned files: ${audit.summary.scannedFiles}`);
  out.push(`Overall score: ${audit.score.overall}/100`);
  out.push("");

  if (!audit.findings.length) {
    out.push("No findings at the selected severity level.");
    return out.join("\n");
  }

  for (const finding of audit.findings) {
    out.push(`[${icon[finding.severity]}] ${finding.ruleId}`);
    out.push(`${finding.title} | confidence ${finding.confidence}%`);
    out.push(`  ${finding.file}:${finding.line}`);
    if (finding.snippet) out.push(`  ${finding.snippet}`);
    out.push(`  Why: ${finding.description}`);
    out.push(`  Better: ${finding.suggestion}`);
    out.push("");
  }

  out.push("Summary");
  out.push("-------");
  out.push(`Critical: ${audit.summary.bySeverity.critical}`);
  out.push(`High: ${audit.summary.bySeverity.high}`);
  out.push(`Warnings: ${audit.summary.bySeverity.warning}`);
  out.push(`Info: ${audit.summary.bySeverity.info}`);
  return out.join("\n");
}
