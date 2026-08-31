import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

export const SOURCE_EXTENSIONS = new Set([
  ".html", ".htm", ".css", ".scss", ".sass", ".less",
  ".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx",
  ".vue", ".svelte", ".ejs", ".hbs", ".njk", ".astro",
  ".json"
]);

export const DEFAULT_IGNORES = new Set([
  ".git", "node_modules", "dist", "build", "coverage", ".next",
  ".nuxt", ".svelte-kit", ".cache", "vendor", ".turbo", ".vite"
]);

export async function collectFiles(root, extraIgnore = []) {
  const absoluteRoot = resolve(root);
  const ignored = new Set([...DEFAULT_IGNORES, ...extraIgnore]);
  const files = [];

  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") && entry.name !== ".env.example") {
        if (entry.isDirectory() || entry.name !== ".env.example") continue;
      }
      if (ignored.has(entry.name)) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(path);
      } else if (entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
        files.push(path);
      }
    }
  }

  const info = await stat(absoluteRoot);
  if (info.isFile()) return [absoluteRoot];
  await walk(absoluteRoot);
  return files;
}

export async function readSourceFile(file, root) {
  const content = await readFile(file, "utf8");
  return {
    path: file,
    relativePath: relative(resolve(root), file) || file,
    extension: extname(file).toLowerCase(),
    content,
    lines: content.split(/\r?\n/)
  };
}
