import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { auditProject } from "../src/core/engine.mjs";
import { DEFAULT_CONFIG } from "../src/core/config.mjs";

const broken = resolve("examples/broken");
const clean = resolve("examples/clean");

test("broken demo triggers critical unstable key detection", async () => {
  const audit = await auditProject(broken, DEFAULT_CONFIG);
  assert.ok(audit.findings.some((f) => f.ruleId === "react.random-key"));
  assert.ok(audit.findings.some((f) => f.severity === "critical"));
});

test("broken demo detects project-level dependency over-engineering", async () => {
  const audit = await auditProject(broken, DEFAULT_CONFIG);
  assert.ok(audit.findings.some((f) => f.ruleId === "project.multiple-animation-libraries"));
  assert.ok(audit.findings.some((f) => f.ruleId === "project.multiple-icon-libraries"));
});

test("clean demo avoids random key and clickable div findings", async () => {
  const audit = await auditProject(clean, DEFAULT_CONFIG);
  assert.equal(audit.findings.some((f) => f.ruleId === "react.random-key"), false);
  assert.equal(audit.findings.some((f) => f.ruleId === "a11y.clickable-div"), false);
});
