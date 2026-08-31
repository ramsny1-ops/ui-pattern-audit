export function markdownReport(audit) {
  const lines = [
    "# UI Pattern Audit Pro Report",
    "",
    `- Framework: ${audit.project.framework}`,
    `- Styling: ${audit.project.styling}`,
    `- Files scanned: ${audit.summary.scannedFiles}`,
    `- Overall score: ${audit.score.overall}/100`,
    `- Findings: ${audit.summary.findings}`,
    "",
    "## Findings",
    ""
  ];
  for (const f of audit.findings) {
    lines.push(`### ${f.severity.toUpperCase()} - ${f.ruleId}`);
    lines.push("");
    lines.push(`**${f.title}** at \`${f.file}:${f.line}\`, confidence ${f.confidence}%`);
    lines.push("");
    if (f.snippet) lines.push(`\`${f.snippet.replace(/`/g, "\\`")}\``);
    lines.push("");
    lines.push(`${f.description}`);
    lines.push("");
    lines.push(`Recommended direction: ${f.suggestion}`);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}
