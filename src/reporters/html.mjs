function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[ch]));
}

export function htmlReport(audit) {
  const cards = audit.findings.map((f) => `
    <article class="finding ${f.severity}">
      <div class="finding-head">
        <span class="severity">${esc(f.severity)}</span>
        <span class="confidence">confidence ${f.confidence}%</span>
      </div>
      <h3>${esc(f.title)}</h3>
      <p class="rule">${esc(f.ruleId)} · ${esc(f.category)}</p>
      <p class="location">${esc(f.file)}:${f.line}</p>
      ${f.snippet ? `<pre><code>${esc(f.snippet)}</code></pre>` : ""}
      <p><strong>Why it matters.</strong> ${esc(f.description)}</p>
      <p><strong>Better direction.</strong> ${esc(f.suggestion)}</p>
      <details>
        <summary>Code example</summary>
        <div class="examples"><div><small>Risky</small><pre>${esc(f.bad)}</pre></div><div><small>Better</small><pre>${esc(f.good)}</pre></div></div>
      </details>
    </article>`).join("\n");

  const categoryRows = Object.entries(audit.score.categoryScores)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, score]) => `<tr><td>${esc(name)}</td><td>${score}/100</td></tr>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>UI Pattern Audit Pro Report</title>
<style>
:root{font-family:ui-sans-serif,system-ui,sans-serif;color:#16181d;background:#f5f6f8}*{box-sizing:border-box}body{margin:0}.wrap{max-width:1120px;margin:auto;padding:48px 24px 80px}.hero,.panel,.finding{background:#fff;border:1px solid #dfe3e8;border-radius:14px}.hero{padding:28px;margin-bottom:20px}.hero h1{margin:0 0 8px;font-size:clamp(2rem,5vw,4rem);letter-spacing:-.04em}.meta{display:flex;flex-wrap:wrap;gap:8px;color:#59606b}.score{font-size:3rem;font-weight:800;margin-top:22px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}.panel{padding:20px}table{width:100%;border-collapse:collapse}td{padding:9px;border-bottom:1px solid #eceff2}.finding{padding:22px;margin:14px 0}.finding-head{display:flex;justify-content:space-between;gap:12px}.severity{font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:.76rem}.critical{border-left:5px solid #8f1d1d}.high{border-left:5px solid #b65b13}.warning{border-left:5px solid #9b821c}.info{border-left:5px solid #4a6485}.confidence,.rule,.location,small{color:#69717d}.finding h3{font-size:1.35rem;margin:10px 0 4px}.rule,.location{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.88rem}pre{overflow:auto;background:#11151a;color:#f6f7f8;border-radius:9px;padding:14px}.examples{display:grid;grid-template-columns:1fr 1fr;gap:12px}summary{cursor:pointer;font-weight:700}@media(max-width:760px){.grid,.examples{grid-template-columns:1fr}.wrap{padding:24px 14px}.hero{padding:20px}}
</style>
</head>
<body><main class="wrap">
<section class="hero"><h1>UI Pattern Audit Pro</h1><div class="meta"><span>${esc(audit.project.framework)}</span><span>${esc(audit.project.styling)}</span><span>${audit.summary.scannedFiles} files</span><span>${audit.summary.findings} findings</span></div><div class="score">${audit.score.overall}/100</div><p>Heuristic quality score. Findings are review signals, not automatic proof of defects.</p></section>
<section class="grid"><div class="panel"><h2>Severity</h2><table><tr><td>Critical</td><td>${audit.summary.bySeverity.critical}</td></tr><tr><td>High</td><td>${audit.summary.bySeverity.high}</td></tr><tr><td>Warning</td><td>${audit.summary.bySeverity.warning}</td></tr><tr><td>Info</td><td>${audit.summary.bySeverity.info}</td></tr></table></div><div class="panel"><h2>Category scores</h2><table>${categoryRows || '<tr><td>No category penalties</td><td>100/100</td></tr>'}</table></div></section>
<section><h2>Findings</h2>${cards || '<div class="panel"><p>No findings at this severity level.</p></div>'}</section>
</main></body></html>`;
}
