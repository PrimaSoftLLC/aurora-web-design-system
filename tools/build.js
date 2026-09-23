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
import { checkParity, copyDecls, rootTokenValues } from './check-parity.js';

const HEADER = (what) => `/* @nikolaynn/design-system — ${what}. Собрано tools/build.js, не править. */\n`;

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

export function buildDist({ root = fileURLToPath(new URL('..', import.meta.url)) } = {}) {
  const tokensCss = readFileSync(join(root, 'tokens.css'), 'utf8');
  const bundleCss = readFileSync(join(root, 'components/bundle.css'), 'utf8');
  const { mismatches } = checkParity(tokensCss, bundleCss);
  if (mismatches.length) throw new Error(`паритет токенов нарушен:\n${mismatches.join('\n')}`);
  const values = rootTokenValues(tokensCss);

  const styles = HEADER('styles.css') + [
    part(root, 'tokens/webfonts-selfhost.css'),
    part(root, 'tokens.css', tokensPart(false)),
    part(root, 'tokens/scoped.css'),
    part(root, 'components/bundle.css', (ast) => {
      ast.walkAtRules('import', (r) => r.remove());
      for (const d of copyDecls(ast, values)) d.remove();
      // Механизм бренда в bundle.css дублирует свои скоупы на рамки артефакта `:where([data-theme=…])`;
      // наборы [data-theme=…] из tokens.css сборка не везёт, поэтому и эти члены списков уходят.
      ast.walkRules((r) => {
        if (!r.selector.includes('[data-theme=')) return;
        const kept = r.selectors.filter((s) => !s.includes('[data-theme='));
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
