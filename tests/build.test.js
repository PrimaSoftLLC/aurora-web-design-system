/**
 * Инварианты собранного CSS и проверка паритета токенов.
 * Запуск: `node tests/build.test.js` после `npm run build`, часть `npm run verify`.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import postcss from 'postcss';
import { checkParity } from '../tools/check-parity.js';
import { buildDist } from '../tools/build.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');
const check = (name, fn) => { fn(); console.log(`ok   сборка: ${name}`); };

const { styles, tokens } = buildDist({ root });
const stylesAst = postcss.parse(styles);

check('паритет репозитория чистый', () => {
  const { mismatches, removed } = checkParity(read('tokens.css'), read('components/bundle.css'));
  assert.deepEqual(mismatches, []);
  // Нижней границы на число копий нет: артефакт уже сам очистил правила `:root{}` в bundle.css
  // (остались пустые заглушки), и сейчас копий 0. Проверка остаётся стражем на случай их возврата.
  console.log(`     паритет: ${removed.size} копий`);
});
check('паритет ловит расхождение', () => {
  const { mismatches } = checkParity(':root{--ds-fg:#111111}', ':root{--ds-fg:#222222}');
  assert.equal(mismatches.length, 1);
  assert.match(mismatches[0], /--ds-fg/);
});
check('паритет не трогает @media и скоупы', () => {
  const bundle = ':root{--ds-dur:180ms}@media (prefers-reduced-motion:reduce){:root{--ds-dur:0ms}}[data-ds-theme]{--ds-dur:1ms}';
  const { mismatches, removed } = checkParity(':root{--ds-dur:180ms}', bundle);
  assert.deepEqual(mismatches, []);
  assert.deepEqual([...removed], ['--ds-dur']);
});
check('нет Google Fonts и рамочных селекторов артефакта', () => {
  assert.doesNotMatch(styles, /fonts\.googleapis\.com/);
  assert.doesNotMatch(styles, /\[data-theme=/);
  assert.doesNotMatch(tokens, /\[data-theme=/);
});
check('каждый url() ведёт к файлу пакета', () => {
  const urls = [...styles.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]);
  assert.ok(urls.length >= 7, 'шесть шрифтов и иконки');
  for (const url of urls) assert.ok(existsSync(join(root, 'dist', url)), `битый url(${url})`);
});
check('шрифты и иконки объявлены', () => {
  const faces = [];
  stylesAst.walkAtRules('font-face', (r) => r.walkDecls('font-family', (d) => faces.push(d.value.replaceAll(/['"]/g, ''))));
  assert.equal(faces.filter((f) => f === 'Inter Tight').length, 4);
  assert.equal(faces.filter((f) => f === 'JetBrains Mono').length, 2);
  assert.equal(faces.filter((f) => f === 'Material Symbols Outlined').length, 1);
});
check('каждый var(--ds-*) где-то объявлен', () => {
  const declared = new Set();
  stylesAst.walkDecls(/^--/, (d) => declared.add(d.prop));
  const used = new Set([...styles.matchAll(/var\(\s*(--ds-[a-z0-9_-]+)/g)].map((m) => m[1]));
  const missing = [...used].filter((u) => !declared.has(u));
  assert.deepEqual(missing, []);
});
check('наборы тем и плотности на месте', () => {
  assert.match(styles, /\[data-ds-theme="RED2"\][^{]*\{[^}]*--ds-brand:/);
  assert.match(styles, /\[data-ds-density="compact"\]/);
});
check('tokens.css — только кастомные свойства', () => {
  postcss.parse(tokens).walkDecls((d) => assert.ok(d.prop.startsWith('--'), `не токен: ${d.prop}`));
  postcss.parse(tokens).walkAtRules((r) => assert.notEqual(r.name, 'font-face'));
});
check('dist совпадает с исходниками', () => {
  assert.equal(read('dist/styles.css'), styles, 'dist устарел: npm run build');
  assert.equal(read('dist/tokens.css'), tokens);
});
