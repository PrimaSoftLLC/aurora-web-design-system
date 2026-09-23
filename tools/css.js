/**
 * Общее для сборки и проверок: наборы токенов из tokens.css, нормализация значений, перенос url().
 */
import { posix } from 'node:path';
import postcss from 'postcss';

export const SET_SELECTORS = {
  ':root, [data-theme="light"]': 'DEFAULT·light',
  '[data-theme="ds-appearance-light-ds-red2"]': 'RED2·light',
  '[data-theme="ds-appearance-dark-ds-default"]': 'DEFAULT·dark',
  '[data-theme="ds-appearance-dark-ds-red2"]': 'RED2·dark',
  ':root': 'root',
};

export const normalize = (value) => value.replace(/\s+/g, ' ').replace(/\s*([,()])\s*/g, '$1').trim().toLowerCase();

/** @returns {Map<string, Map<string, string>>} */
export function readSets(tokensCss) {
  const sets = new Map();
  postcss.parse(tokensCss).each((node) => {
    if (node.type !== 'rule') return;
    const name = SET_SELECTORS[node.selector.replace(/\s+/g, ' ').trim()];
    if (!name) return;
    const set = sets.get(name) ?? new Map();
    node.walkDecls(/^--/, (d) => set.set(d.prop, d.value));
    sets.set(name, set);
  });
  return sets;
}

/** Переписывает относительные url() так, чтобы они работали из toDir (пути от корня пакета, posix). */
export function rebaseUrls(root, fromDir, toDir) {
  root.walkDecls((decl) => {
    decl.value = decl.value.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (whole, quote, url) => {
      if (/^(data:|https?:|\/)/.test(url)) return whole;
      const target = posix.normalize(posix.join(fromDir, url));
      return `url("${posix.relative(toDir, target)}")`;
    });
  });
}
