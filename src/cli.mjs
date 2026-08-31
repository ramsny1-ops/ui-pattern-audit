import { access, readFile, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { auditProject, filterAudit } from "./core/engine.mjs";
import { loadConfig, writeDefaultConfig } from "./core/config.mjs";
import { allRules, getRule } from "./rules/index.mjs";
import { terminalReport } from "./reporters/terminal.mjs";
import { jsonReport } from "./reporters/json.mjs";
import { markdownReport } from "./reporters/markdown.mjs";
import { htmlReport } from "./reporters/html.mjs";

const REPORTERS = {
  terminal: terminalReport,
  json: jsonReport,
  markdown: markdownReport,
  html: htmlReport
};

function parseArgs(argv) {
  const args = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) { args.push(token); continue; }
    const [name, inline] = token.slice(2).split("=", 2);
    if (inline !== undefined) { flags[name] = inline; continue; }
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) { flags[name] = next; i += 1; }
    else flags[name] = true;
  }
  return { args, flags };
}

function help() {
  return `UI Pattern Audit Pro

Usage:
  ui-audit scan [path] [options]
  ui-audit rules [--category accessibility]
  ui-audit explain <rule-id>
  ui-audit init [path]
  ui-audit baseline create [path]
  ui-audit doctor [path]

Scan options:
  --format terminal|json|markdown|html
  --out <file>
  --severity info|warning|high|critical
  --config <path>
  --baseline [path]
  --ci
  --fail-on high|critical|never

Examples:
  ui-audit scan ./src
  ui-audit scan . --severity high
  ui-audit scan . --format html --out report.html
  ui-audit baseline create .
  ui-audit scan . --baseline --ci
  ui-audit explain react.random-key
`;
}

function severityRank(value) {
  return ({ info: 0, warning: 1, high: 2, critical: 3 })[value] ?? -1;
}

async function pathExists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function applyBaseline(audit, root, flag) {
  if (!flag) return audit;
  const baselinePath = typeof flag === "string"
    ? resolve(flag)
    : join(resolve(root), ".ui-audit-baseline.json");
  if (!(await pathExists(baselinePath))) return audit;
  const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
  const known = new Set(baseline.fingerprints ?? []);
  const findings = audit.findings.filter((f) => !known.has(f.fingerprint));
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
      }
    }
  };
}

async function commandScan(args, flags) {
  const root = resolve(args[0] ?? ".");
  const config = await loadConfig(root, flags.config);
  let audit = await auditProject(root, config);
  audit = await applyBaseline(audit, root, flags.baseline);
  audit = filterAudit(audit, { minimumSeverity: flags.severity ?? "info" });

  const format = flags.format ?? "terminal";
  const reporter = REPORTERS[format];
  if (!reporter) throw new Error(`Unknown format: ${format}`);
  const output = reporter(audit);
  if (flags.out) {
    await writeFile(resolve(flags.out), output, "utf8");
    console.log(`Report written to ${resolve(flags.out)}`);
  } else {
    process.stdout.write(`${output}${output.endsWith("\n") ? "" : "\n"}`);
  }

  const failOn = flags["fail-on"] ?? (flags.ci ? "high" : "never");
  if (failOn !== "never") {
    const threshold = severityRank(failOn);
    const shouldFail = audit.findings.some((f) => severityRank(f.severity) >= threshold);
    if (shouldFail) process.exitCode = 2;
  }
}

function commandRules(flags) {
  const category = flags.category;
  const rows = allRules
    .filter((rule) => !category || rule.category === category)
    .sort((a, b) => a.category.localeCompare(b.category) || a.id.localeCompare(b.id));
  console.log(`Rules: ${rows.length}\n`);
  for (const rule of rows) {
    console.log(`${rule.id.padEnd(42)} ${rule.severity.padEnd(8)} ${String(rule.confidence).padStart(3)}%  ${rule.title}`);
  }
}

function commandExplain(id) {
  if (!id) throw new Error("Provide a rule ID. Example: ui-audit explain react.random-key");
  const rule = getRule(id);
  if (!rule) throw new Error(`Unknown rule: ${id}`);
  console.log(`${rule.id}\n${"=".repeat(rule.id.length)}\n`);
  console.log(`Category: ${rule.category}`);
  console.log(`Severity: ${rule.severity}`);
  console.log(`Confidence: ${rule.confidence}%`);
  console.log(`\n${rule.title}\n`);
  console.log(`${rule.description}\n`);
  console.log(`Recommended direction:\n${rule.suggestion}\n`);
  console.log(`Risky example:\n${rule.bad}\n`);
  console.log(`Better example:\n${rule.good}\n`);
}

async function commandInit(path) {
  const root = resolve(path ?? ".");
  const configPath = await writeDefaultConfig(root);
  console.log(`Created ${configPath}`);
}

async function commandBaseline(args, flags) {
  if (args[0] !== "create") throw new Error("Use: ui-audit baseline create [path]");
  const root = resolve(args[1] ?? ".");
  const config = await loadConfig(root, flags.config);
  const audit = await auditProject(root, config);
  const baselinePath = resolve(flags.out ?? join(root, ".ui-audit-baseline.json"));
  const data = {
    createdAt: new Date().toISOString(),
    scannedFiles: audit.summary.scannedFiles,
    findings: audit.summary.findings,
    fingerprints: audit.findings.map((f) => f.fingerprint)
  };
  await writeFile(baselinePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Baseline created at ${baselinePath} with ${data.findings} existing findings.`);
}

async function commandDoctor(path) {
  const root = resolve(path ?? ".");
  const config = await loadConfig(root);
  const audit = await auditProject(root, config);
  console.log("UI Pattern Audit Pro Doctor");
  console.log("===========================");
  console.log(`Node: ${process.version}`);
  console.log(`Root: ${root}`);
  console.log(`Config: ${config.path ?? "default built-in configuration"}`);
  console.log(`Framework: ${audit.project.framework}`);
  console.log(`Styling: ${audit.project.styling}`);
  console.log(`Files discovered: ${audit.summary.scannedFiles}`);
  console.log(`Rules loaded: ${allRules.length}`);
  console.log(`Status: ${audit.summary.scannedFiles ? "ready" : "no supported source files found"}`);
}

export async function runCli(argv) {
  const { args, flags } = parseArgs(argv);
  const command = args.shift() ?? "help";
  if (command === "help" || flags.help) return console.log(help());
  if (command === "scan") return commandScan(args, flags);
  if (command === "rules") return commandRules(flags);
  if (command === "explain") return commandExplain(args[0]);
  if (command === "init") return commandInit(args[0]);
  if (command === "baseline") return commandBaseline(args, flags);
  if (command === "doctor") return commandDoctor(args[0]);
  throw new Error(`Unknown command: ${command}\n\n${help()}`);
}
