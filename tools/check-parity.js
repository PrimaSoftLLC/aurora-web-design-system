/**
 * Паритет копий токенов в components/bundle.css с tokens.css.
 * Копии живут в bundle.css ради превью артефакта; сборка их вырезает, и значения обязаны совпадать.
 * Копия — объявление кастомного свойства в правиле верхнего уровня с селектором ровно `:root`,
 * если такое свойство есть в любом :root-наборе tokens.css. @media, скоупы data-ds-* и списки селекторов
 * не копии: это механизм системы, их сборка не трогает.
 * Запуск: `node tools/check-parity.js` (выход 1 при расхождении).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { readSets, normalize } from './css.js';

export function copyDecls(bundleRoot, tokenValues) {
  const decls = [];
  bundleRoot.each((node) => {
    if (node.type !== 'rule' || node.selector.trim() !== ':root') return;
    node.each((d) => { if (d.type === 'decl' && tokenValues.has(d.prop)) decls.push(d); });
  });
  return decls;
}

export function rootTokenValues(tokensCss) {
  const sets = readSets(tokensCss);
  const values = new Map([...(sets.get('root') ?? []), ...(sets.get('DEFAULT·light') ?? [])]);
  // tokens.css из теста может быть просто `:root{…}` — он попадает в 'root'.
  return values;
}

export function checkParity(tokensCss, bundleCss) {
  const values = rootTokenValues(tokensCss);
  const mismatches = [];
  const removed = new Set();
  for (const d of copyDecls(postcss.parse(bundleCss), values)) {
    removed.add(d.prop);
    if (normalize(d.value) !== normalize(values.get(d.prop))) {
      mismatches.push(`${d.prop}: bundle.css «${d.value}» ≠ tokens.css «${values.get(d.prop)}»`);
    }
  }
  return { removed, mismatches };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = new URL('..', import.meta.url);
  const { mismatches, removed } = checkParity(
    readFileSync(new URL('tokens.css', root), 'utf8'),
    readFileSync(new URL('components/bundle.css', root), 'utf8'),
  );
  for (const m of mismatches) console.error(`FAIL паритет: ${m}`);
  console.log(`${mismatches.length ? 'FAIL' : 'ok  '} паритет: ${removed.size} копий, ${mismatches.length} расхождений`);
  process.exit(mismatches.length ? 1 : 0);
}
