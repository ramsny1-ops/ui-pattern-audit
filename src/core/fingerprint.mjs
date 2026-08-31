import { createHash } from "node:crypto";

export function findingFingerprint(finding) {
  return createHash("sha1")
    .update([finding.ruleId, finding.file, finding.line, finding.snippet.trim()].join("|"))
    .digest("hex")
    .slice(0, 16);
}
