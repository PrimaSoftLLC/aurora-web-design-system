/**
 * Каскад собранного dist/styles.css в настоящем браузере: четыре рендера приёмки, вложенные скоупы, плотность
 * без темы-предка. У каждого элемента сверяется каждый токен его набора tokens.css (ключи набора и
 * DEFAULT·<светлость>) после подстановки var(). Плюс фальсифицируемость: порча копий в bundle.css валит сборку
 * на паритете, а dist, собранный в обход паритета, этот тест ловит расхождениями.
 * Chrome: переменная CHROME_BIN или стандартный путь. В CI ubuntu-latest Chrome предустановлен.
 * Запуск: `node tests/dist-cascade.test.js` после `npm run build`, часть `npm run verify`.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import postcss from 'postcss';
import { readSets, normalize, lookup, resolve } from '../tools/css.js';
import { buildDist } from '../tools/build.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const chrome = [
  process.env.CHROME_BIN,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && existsSync(p));
assert.ok(chrome, 'Chrome не найден: задайте CHROME_BIN');

/** Рендерит base/tests/fixtures/cascade.html (он берёт base/dist/styles.css) и возвращает токены элементов. */
function render(base) {
  const page = pathToFileURL(join(base, 'tests/fixtures/cascade.html')).href;
  const run = spawnSync(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox', '--allow-file-access-from-files',
    '--virtual-time-budget=2000', '--dump-dom', page], { encoding: 'utf8', timeout: 60000 });
  const json = /<pre id="out">([^<]*)<\/pre>/.exec(run.stdout)?.[1];
  assert.ok(json, `Chrome не отдал результат: ${run.stderr}`);
  return JSON.parse(json.replaceAll('&quot;', '"').replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&amp;', '&'));
}

const sets = readSets(readFileSync(join(root, 'tokens.css'), 'utf8'));
const cases = [
  ['c-default-light', 'DEFAULT·light'], ['c-default-dark', 'DEFAULT·dark'],
  ['c-red2-light', 'RED2·light'], ['c-red2-dark', 'RED2·dark'],
  ['n-dark-in-light', 'DEFAULT·dark'], ['n-red2-in-default', 'RED2·light'],
  ['n-compact-in-red2', 'RED2·light'], ['n-red2-light-in-dark', 'RED2·light'],
  ['bare-compact', 'DEFAULT·light'],
];

/** Все расхождения каскада с tokens.css: «элемент токен: получено ≠ ждали». */
function compare(got) {
  const mismatches = [];
  for (const [id, set] of cases) {
    const keys = new Set([...sets.get(set).keys(), ...sets.get(`DEFAULT·${set.split('·')[1]}`).keys()]);
    for (const prop of keys) {
      const want = resolve(sets, set, lookup(sets, set, prop));
      const have = normalize(got[id]?.[prop] ?? '');
      if (have !== want) mismatches.push(`${id} ${prop}: «${have}» ≠ ${set} «${want}»`);
    }
  }
  return mismatches;
}

// 1. Настоящий dist.
const got = render(root);
const mismatches = compare(got);
assert.deepEqual(mismatches, [], `каскад расходится с tokens.css:\n${mismatches.join('\n')}`);
for (const [id, set] of cases) console.log(`ok   каскад: ${id} = ${set}`);
assert.notEqual(got['c-red2-light']['--ds-brand'], got['c-default-light']['--ds-brand'], 'RED2 перекрашивает бренд');
assert.equal(got['c-red2-light']['--ds-focus-color'], got['c-red2-light']['--ds-brand'], 'кольцо фокуса в цвет темы');
assert.notEqual(got['c-default-dark']['--ds-control-h'], got['c-default-light']['--ds-control-h'], 'compact меняет высоту');
assert.ok(got['bare-compact']['--ds-brand'], 'плотность без темы-предка: пустой --ds-brand');
assert.equal(got['bare-compact']['--ds-brand'], normalize(sets.get('DEFAULT·light').get('--ds-brand')), 'bare-compact: бренд DEFAULT·light');
console.log('ok   каскад: RED2, фокус, плотность, плотность без темы');

// 2. Фальсифицируемость: порча load-bearing копий bundle.css во временной копии исходников.
const tmp = mkdtempSync(join(tmpdir(), 'ds-cascade-'));
try {
  for (const f of ['tokens.css', 'tokens/scoped.css', 'tokens/webfonts-selfhost.css', 'components/bundle.css',
    'tests/fixtures/cascade.html']) {
    mkdirSync(dirname(join(tmp, f)), { recursive: true });
    copyFileSync(join(root, f), join(tmp, f));
  }
  const bundle = postcss.parse(readFileSync(join(tmp, 'components/bundle.css'), 'utf8'));
  let hits = 0;
  bundle.each((r) => {
    if (r.type !== 'rule') return;
    const members = r.selectors.map((s) => s.trim());
    r.each((d) => {
      if (d.type !== 'decl') return;
      if (members.length === 1 && members[0] === '[data-ds-appearance="light"]' && d.prop === '--ds-fg-subtle') {
        d.value = '#00ff00'; hits += 1;
      }
      if (members.includes('[data-ds-theme="RED2"]') && d.prop === '--ds-_brand--light') { d.value = '#ff00ff'; hits += 1; }
    });
  });
  assert.equal(hits, 2, 'порча: обе мутации применены');
  writeFileSync(join(tmp, 'components/bundle.css'), bundle.toString());

  assert.throws(() => buildDist({ root: tmp }), /паритет токенов нарушен[\s\S]*--ds-fg-subtle[\s\S]*--ds-_brand--light/);
  console.log('ok   каскад: порча копий bundle.css валит сборку на паритете');

  mkdirSync(join(tmp, 'dist'));
  writeFileSync(join(tmp, 'dist/styles.css'), buildDist({ root: tmp, parity: false }).styles);
  const bad = compare(render(tmp));
  const has = (re) => bad.some((m) => re.test(m));
  assert.ok(has(/^c-red2-light --ds-fg-subtle: «#00ff00»/), `порча --ds-fg-subtle не поймана:\n${bad.join('\n')}`);
  assert.ok(has(/^n-compact-in-red2 --ds-brand: «#ff00ff»/), `порча --ds-brand не поймана:\n${bad.join('\n')}`);
  console.log(`ok   каскад: dist в обход паритета — ${bad.length} расхождений, порча поймана`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
