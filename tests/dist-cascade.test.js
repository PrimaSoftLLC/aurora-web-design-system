/**
 * Каскад собранного dist/styles.css в настоящем браузере: четыре рендера приёмки и вложенные скоупы.
 * Chrome: переменная CHROME_BIN или стандартный путь. В CI ubuntu-latest Chrome предустановлен.
 * Запуск: `node tests/dist-cascade.test.js` после `npm run build`, часть `npm run verify`.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import postcss from 'postcss';
import { readSets, normalize } from '../tools/css.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const chrome = [
  process.env.CHROME_BIN,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && existsSync(p));
assert.ok(chrome, 'Chrome не найден: задайте CHROME_BIN');

const page = pathToFileURL(join(root, 'tests/fixtures/cascade.html')).href;
const run = spawnSync(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox', '--allow-file-access-from-files',
  '--virtual-time-budget=2000', '--dump-dom', page], { encoding: 'utf8', timeout: 60000 });
const json = /<pre id="out">([^<]*)<\/pre>/.exec(run.stdout)?.[1];
assert.ok(json, `Chrome не отдал результат: ${run.stderr}`);
const got = JSON.parse(json.replaceAll('&quot;', '"'));

const sets = readSets(readFileSync(join(root, 'tokens.css'), 'utf8'));
// Ссылку `var(--ds-n-…)` разрешаем через набор, затем DEFAULT·light: нейтральная рампа живёт только
// в :root-наборе, остальные наборы её не переопределяют.
const lookup = (set, prop) => sets.get(set).get(prop) ?? sets.get('DEFAULT·light').get(prop);
const expect = (set, prop) => {
  let v = normalize(lookup(set, prop) ?? '');
  for (let ref; (ref = /^var\((--[a-z0-9-]+)\)$/.exec(v)); ) v = normalize(lookup(set, ref[1]) ?? '');
  return v;
};
const isLiteral = (v) => v && !v.startsWith('var(');

const cases = [
  ['c-default-light', 'DEFAULT·light'], ['c-default-dark', 'DEFAULT·dark'],
  ['c-red2-light', 'RED2·light'], ['c-red2-dark', 'RED2·dark'],
  ['n-dark-in-light', 'DEFAULT·dark'], ['n-red2-in-default', 'RED2·light'],
];
for (const [id, set] of cases) {
  for (const prop of ['--ds-brand', '--ds-bg', '--ds-fg']) {
    const want = expect(set, prop);
    if (!isLiteral(want)) continue;
    assert.equal(normalize(got[id][prop]), want, `${id} ${prop}`);
  }
  console.log(`ok   каскад: ${id} = ${set}`);
}
assert.notEqual(got['c-red2-light']['--ds-brand'], got['c-default-light']['--ds-brand'], 'RED2 перекрашивает бренд');
assert.equal(got['c-red2-light']['--ds-focus-color'], got['c-red2-light']['--ds-brand'], 'кольцо фокуса в цвет темы');
assert.notEqual(got['c-default-dark']['--ds-control-h'], got['c-default-light']['--ds-control-h'], 'compact меняет высоту');
console.log('ok   каскад: RED2, фокус, плотность');
