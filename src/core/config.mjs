import { access, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

export const DEFAULT_CONFIG = {
  extends: "recommended",
  ignore: [],
  rules: {},
  thresholds: {
    maxHigh: 0,
    maxCritical: 0
  }
};

async function canAccess(path) {
  try { await access(path); return true; } catch { return false; }
}

export async function loadConfig(root, explicitPath) {
  const path = explicitPath ? resolve(explicitPath) : join(resolve(root), ".ui-auditrc.json");
  if (!(await canAccess(path))) return { ...DEFAULT_CONFIG, path: null };
  const user = JSON.parse(await readFile(path, "utf8"));
  return {
    ...DEFAULT_CONFIG,
    ...user,
    thresholds: { ...DEFAULT_CONFIG.thresholds, ...(user.thresholds ?? {}) },
    rules: { ...DEFAULT_CONFIG.rules, ...(user.rules ?? {}) },
    path
  };
}

export async function writeDefaultConfig(root) {
  const path = join(resolve(root), ".ui-auditrc.json");
  await writeFile(path, `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`, "utf8");
  return path;
}
