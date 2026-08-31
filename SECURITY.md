# Security Policy

UI Pattern Audit Pro only reads source files unless the user explicitly asks it to write a config, baseline or report. It does not execute scanned project code.

Do not add detectors that `eval`, import or execute arbitrary source from the audited project. Project metadata should be parsed as data.

If a rule detects a possible credential, reports should avoid reproducing the full secret in future versions. This kit currently reports the matched source line, so sensitive reports should be handled as source-code artifacts.
