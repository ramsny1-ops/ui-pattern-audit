import { collectFiles, readSourceFile } from "../utils/files.mjs";
import { detectProject } from "./project.mjs";
import { scoreAudit } from "./score.mjs";
import { findingFingerprint } from "./fingerprint.mjs";
import { lineRules, fileRules, projectRules } from "../rules/index.mjs";

const SEVERITY_ORDER = { info: 0, warning: 1, high: 2, critical: 3 };

function lineFromIndex(content, index) {
  if (!Number.isFinite(index) || index < 0) return 1;
  return content.slice(0, index).split(/\r?\n/).length;
}

function snippetAt(file, lineNumber) {
  return (file.lines[lineNumber - 1] ?? "").trim().slice(0, 260);
}

function isRuleDisabledByConfig(rule, config) {
  return config.rules?.[rule.id] === "off";
}

function severityFor(rule, config) {
  const override = config.rules?.[rule.id];
  if (override === "warn") return "warning";
  if (override === "error") return rule.severity === "critical" ? "critical" : "high";
  if (["info", "warning", "high", "critical"].includes(override)) return override;
  return rule.severity;
}

function inlineSuppressed(file, lineIndex, ruleId) {
  const current = file.lines[lineIndex] ?? "";
  const previous = file.lines[lineIndex - 1] ?? "";
  const disableFile = new RegExp(`ui-audit-disable(?:\\s+${escapeRegex(ruleId)}|\\s+all)?`, "i");
  const disableNext = new RegExp(`ui-audit-disable-next-line(?:\\s+${escapeRegex(ruleId)}|\\s+all)?`, "i");
  if (file.lines.slice(0, 8).some((line) => disableFile.test(line))) return true;
  return disableNext.test(previous) || /ui-audit-disable-line/i.test(current);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function makeFinding(rule, config, data) {
  const finding = {
    ruleId: rule.id,
    category: rule.category,
    severity: severityFor(rule, config),
    confidence: rule.confidence,
    title: rule.title,
    description: rule.description,
    suggestion: rule.suggestion,
    bad: rule.bad,
    good: rule.good,
    file: data.file,
    line: data.line ?? 1,
    snippet: data.snippet ?? "",
    meta: data.meta ?? null
  };
  finding.fingerprint = findingFingerprint(finding);
  return finding;
}

function applyLineRules(file, config) {
  const findings = [];
  file.lines.forEach((line, index) => {
    for (const rule of lineRules) {
      if (isRuleDisabledByConfig(rule, config)) continue;
      if (!rule.regex.test(line)) continue;
      rule.regex.lastIndex = 0;
      if (inlineSuppressed(file, index, rule.id)) continue;
      findings.push(makeFinding(rule, config, {
        file: file.relativePath,
        line: index + 1,
        snippet: line.trim().slice(0, 260)
      }));
    }
  });
  return findings;
}

function applyFileRules(file, config) {
  const findings = [];
  for (const rule of fileRules) {
    if (isRuleDisabledByConfig(rule, config)) continue;
    let matches = [];
    if (typeof rule.test === "function") {
      matches = rule.test(file) ?? [];
    } else if (rule.regex) {
      const index = file.content.search(rule.regex);
      if (index >= 0) matches = [{ index }];
    }
    for (const match of matches) {
      const line = lineFromIndex(file.content, match.index ?? 0);
      if (inlineSuppressed(file, line - 1, rule.id)) continue;
      findings.push(makeFinding(rule, config, {
        file: file.relativePath,
        line,
        snippet: snippetAt(file, line),
        meta: match.meta
      }));
    }
  }
  return findings;
}

export async function auditProject(root, config) {
  const paths = await collectFiles(root, config.ignore ?? []);
  const files = await Promise.all(paths.map((file) => readSourceFile(file, root)));
  const project = await detectProject(root);
  let findings = [];

  for (const file of files) {
    findings.push(...applyLineRules(file, config));
    findings.push(...applyFileRules(file, config));
  }

  const context = { root, files, project, config };
  for (const rule of projectRules) {
    if (isRuleDisabledByConfig(rule, config)) continue;
    for (const result of rule.run(context) ?? []) {
      findings.push(makeFinding(rule, config, result));
    }
  }

  findings.sort((a, b) => {
    const severity = SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity];
    if (severity) return severity;
    if (a.file !== b.file) return a.file.localeCompare(b.file);
    return a.line - b.line;
  });

  const summary = {
    scannedFiles: files.length,
    findings: findings.length,
    bySeverity: {
      critical: findings.filter((f) => f.severity === "critical").length,
      high: findings.filter((f) => f.severity === "high").length,
      warning: findings.filter((f) => f.severity === "warning").length,
      info: findings.filter((f) => f.severity === "info").length
    },
    byCategory: Object.fromEntries(
      [...new Set(findings.map((f) => f.category))]
        .sort()
        .map((category) => [category, findings.filter((f) => f.category === category).length])
    )
  };
  const score = scoreAudit(findings, files.length);
  return { root, project, config, files, findings, summary, score };
}

export function filterAudit(audit, options = {}) {
  const minimum = options.minimumSeverity ?? "info";
  const floor = SEVERITY_ORDER[minimum] ?? 0;
  const findings = audit.findings.filter((f) => SEVERITY_ORDER[f.severity] >= floor);
  return {
    ...audit,
    findings,
    summary: {
      ...audit.summary,
      findings: findings.length,
      bySeverity: {
        critical: findings.filter((f) => f.severity === "critical").length,
        high: findings.filter((f) => f.severity === "high").length,
        warning: findings.filter((f) => f.severity === "warning").length,
        info: findings.filter((f) => f.severity === "info").length
      },
      byCategory: Object.fromEntries(
        [...new Set(findings.map((f) => f.category))]
          .sort()
          .map((category) => [category, findings.filter((f) => f.category === category).length])
      )
    },
    score: scoreAudit(findings, audit.summary.scannedFiles)
  };
}
