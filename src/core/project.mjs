import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

export async function detectProject(root) {
  const base = resolve(root);
  const packagePath = join(base, "package.json");
  let pkg = {};
  if (await exists(packagePath)) {
    try { pkg = JSON.parse(await readFile(packagePath, "utf8")); } catch { /* ignore */ }
  }
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  const has = (name) => Object.hasOwn(deps, name);
  const framework = has("next") ? "Next.js"
    : has("react") ? "React"
    : has("vue") ? "Vue"
    : has("svelte") ? "Svelte"
    : has("astro") ? "Astro"
    : "Unknown or vanilla";
  const styling = has("tailwindcss") ? "Tailwind CSS"
    : has("styled-components") ? "styled-components"
    : has("@emotion/react") ? "Emotion"
    : "CSS or unknown";
  const animation = ["framer-motion", "motion", "gsap", "animejs", "aos"].filter(has);
  const icons = ["lucide-react", "@heroicons/react", "react-icons", "@fortawesome/react-fontawesome"].filter(has);
  return {
    packageName: pkg.name ?? null,
    framework,
    styling,
    animationLibraries: animation,
    iconLibraries: icons,
    dependencies: deps,
    packageJsonFound: Boolean(pkg.name || Object.keys(deps).length)
  };
}
