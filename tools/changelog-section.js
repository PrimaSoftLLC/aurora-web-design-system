/**
 * Тело раздела `## [X.Y.Z]` из CHANGELOG.md — текст GitHub Release в ci.yml.
 * Запуск: `node tools/changelog-section.js 2.0.0` (выход 1, если раздела нет).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function changelogSection(markdown, version) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((l) => l.startsWith(`## [${version}]`));
  if (start < 0) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith('## '));
  return (end < 0 ? rest : rest.slice(0, end)).join('\n').trim();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const text = changelogSection(readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8'), process.argv[2]);
  if (text === null) { console.error(`CHANGELOG.md: нет раздела ## [${process.argv[2]}]`); process.exit(1); }
  console.log(text);
}
