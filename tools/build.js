/**
 * Собирает dist/styles.css и dist/tokens.css — то, что подключают приложения (ANGULAR.md, CONTRIBUTING.md
 * «Generated files»). dist/ не коммитится.
 * Запуск: `npm run build` (и prepack).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { rebaseUrls, SET_SELECTORS } from './css.js';
import { checkParity } from './check-parity.js';

/** Рамки артефакта в списках селекторов bundle.css: DEFAULT·light — это :root пакета, остальные рамки не едут. */
const FRAME_TO_ROOT = ':where([data-theme="light"])';

const HEADER = (what) => `/* @primasoftllc/design-system — ${what}. Собрано tools/build.js, не править. */\n`;

function part(root, file, transform) {
  const ast = postcss.parse(readFileSync(join(root, file), 'utf8'), { from: file });
  transform?.(ast);
  const dir = file.includes('/') ? file.slice(0, file.lastIndexOf('/')) : '.';
  rebaseUrls(ast, dir, 'dist');
  return `/* ── ${file} ── */\n${ast.toString().trim()}\n`;
}

/** tokens.css без рамочных наборов артефакта; onlyTokens — без @font-face и классов. */
const tokensPart = (onlyTokens) => (ast) => {
  ast.each((node) => {
    if (node.type === 'rule') {
      const name = SET_SELECTORS[node.selector.replace(/\s+/g, ' ').trim()];
      if (name === 'DEFAULT·light') node.selector = ':root';
      else if (!name && (onlyTokens || node.selector.includes('[data-theme='))) node.remove();
      else if (name && name !== 'root') node.remove();
    } else if (node.type === 'atrule' && onlyTokens) node.remove();
  });
};

/**
 * @param {{root?: string, parity?: boolean}} options parity: false — только для теста фальсифицируемости каскада.
 */
export function buildDist({ root = fileURLToPath(new URL('..', import.meta.url)), parity = true } = {}) {
  const tokensCss = readFileSync(join(root, 'tokens.css'), 'utf8');
  const bundleCss = readFileSync(join(root, 'components/bundle.css'), 'utf8');
  const { mismatches } = checkParity(tokensCss, bundleCss);
  if (parity && mismatches.length) throw new Error(`паритет токенов нарушен:\n${mismatches.join('\n')}`);

  const styles = HEADER('styles.css') + [
    part(root, 'tokens/webfonts-selfhost.css'),
    part(root, 'tokens.css', tokensPart(false)),
    part(root, 'tokens/scoped.css'),
    part(root, 'components/bundle.css', (ast) => {
      ast.walkAtRules('import', (r) => r.remove());
      // Копии токенов в bundle.css не вырезаются: они работают в каскаде, их стережёт паритет.
      // Механизм бренда дублирует свои скоупы на рамки артефакта `:where([data-theme=…])`. Рамка светлой
      // DEFAULT становится `:where(:root)` — иначе у элемента с одной плотностью без темы-предка правило
      // пересчёта собирает пустой --ds-brand; остальные рамки (их наборы из tokens.css не едут) уходят.
      ast.walkRules((r) => {
        if (!r.selector.includes('[data-theme=')) return;
        const kept = [...new Set(r.selectors.map((s) => s.trim())
          .map((s) => (s === FRAME_TO_ROOT ? ':where(:root)' : s))
          .filter((s) => !s.includes('[data-theme=')))];
        if (kept.length) r.selectors = kept; else r.remove();
      });
      ast.walkRules((r) => { if (r.nodes.length === 0 || r.nodes.every((n) => n.type === 'comment')) r.remove(); });
    }),
  ].join('\n');

  const tokens = HEADER('tokens.css') + [
    part(root, 'tokens.css', tokensPart(true)),
    part(root, 'tokens/scoped.css'),
  ].join('\n');

  return { styles, tokens };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const { styles, tokens } = buildDist({ root });
  mkdirSync(join(root, 'dist'), { recursive: true });
  writeFileSync(join(root, 'dist/styles.css'), styles);
  writeFileSync(join(root, 'dist/tokens.css'), tokens);
  console.log(`ok   dist/styles.css ${styles.length} Б, dist/tokens.css ${tokens.length} Б`);
}
