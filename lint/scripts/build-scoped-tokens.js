/**
 * Собирает `tokens/scoped.css` — цветовые наборы на атрибутах `data-ds-*`.
 * Запуск: `node lint/scripts/build-scoped-tokens.js`
 *
 * Зачем. После миграции `tokens.css` генерирует тип артефакта, и наборы в нём
 * адресованы атрибутом рамки `data-theme="ds-appearance-…"`. Вне каталога —
 * в `overview.html`, в выгруженной поставке, в любой странице, собранной по
 * README, — скоупы `data-ds-theme` / `data-ds-appearance` ничего не
 * перекрашивали: блоки тем в `bundle.css` остались пустыми. Этот файл
 * возвращает их, взяв значения из `tokens.css` как есть, поэтому источник
 * правды один (`tokens.json` → `tokens.css`), а расхождение ловит
 * `lint/test/run.js`.
 *
 * Селекторы — те же, что в `bundle.css`: один уровень вложенности скоупа
 * переопределяет предыдущий. Корень (`:root`) здесь не объявлен — его держит
 * `tokens.css`. Плотность уже живёт в `bundle.css`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { isDirectRun } from './check-names.js';

const SETS = [
  {
    name: 'DEFAULT · light',
    from: ':root, [data-theme="light"]',
    selectors: [
      '[data-ds-theme="DEFAULT"]:not([data-ds-appearance="dark"]):not([data-ds-appearance="dark"] *)',
      '[data-ds-appearance="light"]:not([data-ds-theme="RED2"]):not([data-ds-theme="RED2"] *)',
      '[data-ds-appearance="light"][data-ds-theme="DEFAULT"]',
      '[data-ds-appearance="light"] [data-ds-theme="DEFAULT"]',
      '[data-ds-theme="DEFAULT"] [data-ds-appearance="light"]:not([data-ds-theme="RED2"])',
    ],
  },
  {
    name: 'RED2 · light',
    from: '[data-theme="ds-appearance-light-ds-red2"]',
    selectors: [
      '[data-ds-theme="RED2"]:not([data-ds-appearance="dark"]):not([data-ds-appearance="dark"] *)',
      '[data-ds-appearance="light"][data-ds-theme="RED2"]',
      '[data-ds-appearance="light"] [data-ds-theme="RED2"]',
      '[data-ds-theme="RED2"] [data-ds-appearance="light"]:not([data-ds-theme="DEFAULT"])',
    ],
  },
  {
    name: 'DEFAULT · dark',
    from: '[data-theme="ds-appearance-dark-ds-default"]',
    selectors: [
      '[data-ds-appearance="dark"]:not([data-ds-theme="RED2"]):not([data-ds-theme="RED2"] *)',
      '[data-ds-appearance="dark"][data-ds-theme="DEFAULT"]',
      '[data-ds-appearance="dark"] [data-ds-theme="DEFAULT"]:not([data-ds-appearance="light"]):not([data-ds-appearance="light"] *)',
      '[data-ds-theme="DEFAULT"] [data-ds-appearance="dark"]:not([data-ds-theme="RED2"])',
    ],
  },
  {
    name: 'RED2 · dark',
    from: '[data-theme="ds-appearance-dark-ds-red2"]',
    selectors: [
      '[data-ds-appearance="dark"][data-ds-theme="RED2"]',
      '[data-ds-appearance="dark"] [data-ds-theme="RED2"]:not([data-ds-appearance="light"]):not([data-ds-appearance="light"] *)',
      '[data-ds-theme="RED2"] [data-ds-appearance="dark"]:not([data-ds-theme="DEFAULT"])',
    ],
  },
];

export function buildScopedTokens(tokensCss) {
  const css = tokensCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = new Map();
  for (const [, sel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const key = sel.trim();
    if (!blocks.has(key)) blocks.set(key, body);
  }
  let out =
    '/* Сгенерировано из tokens.css. Не править руками: node lint/scripts/build-scoped-tokens.js\n' +
    '   Подключать после tokens.css и до components/bundle.css — в страницах вне каталога. */\n';
  for (const set of SETS) {
    const body = blocks.get(set.from);
    if (!body) throw new Error(`в tokens.css нет блока ${set.from} (${set.name})`);
    const decls = [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, n, v]) => `  ${n}: ${v.trim()};`);
    if (!decls.length) throw new Error(`пустой блок ${set.from} (${set.name})`);
    out += `\n/* ${set.name} */\n${set.selectors.join(',\n')} {\n${decls.join('\n')}\n}\n`;
  }
  return out;
}

export const tokensCssPath = fileURLToPath(new URL('../../tokens.css', import.meta.url));
export const scopedCssPath = fileURLToPath(new URL('../../tokens/scoped.css', import.meta.url));

if (isDirectRun(import.meta.url)) {
  const out = buildScopedTokens(readFileSync(tokensCssPath, 'utf8'));
  writeFileSync(scopedCssPath, out, 'utf8');
  console.log(`tokens/scoped.css: ${out.split('\n').filter((l) => l.trim().startsWith('--')).length} объявлений в 4 наборах`);
}
