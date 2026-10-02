import { readFileSync, copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, relative, dirname, isAbsolute, sep } from 'node:path';
import { parse } from 'parse5';
export function assetPath(root, from, url) {
  if (/^(?:data:|blob:|#)/.test(url)) return null;
  const u = new URL(url, `http://aurora.local/${from}`);
  if (u.origin !== 'http://aurora.local') throw new Error(`${from}: external asset ${url}`);
  const path = resolve(root, '.' + decodeURIComponent(u.pathname));
  const rel = relative(resolve(root), path);
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error(`${from}: unsafe asset ${url}`);
  if (!existsSync(path)) throw new Error(`${from}: missing asset ${url}`);
  return rel;
}
export function previewAssets(root, from, html) {
  const refs = new Set();
  const add = url => { const path = assetPath(root, from, url); if (path) refs.add(path); };
  const urls = text => { for (const m of text.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) add(m[1]); };
  const walk = node => {
    for (const a of node.attrs ?? []) {
      if ((a.name === 'src' || a.name === 'poster' || (node.tagName === 'link' && a.name === 'href'))) add(a.value);
      if (a.name === 'style') urls(a.value);
    }
    if (node.tagName === 'style') urls(node.childNodes.map(n => n.value ?? '').join(''));
    if (node.tagName === 'script') for (const m of node.childNodes.map(n => n.value ?? '').join('').matchAll(/\b(?:src|logoSrc|poster)\s*[:=]\s*['"]([^'"]+)['"]/g)) add(m[1]);
    for (const child of node.childNodes ?? []) walk(child);
  };
  walk(parse(html));
  return [...refs];
}
export function copyAsset({ root, outDir, path }) {
  const target = resolve(outDir, path);
  const rel = relative(resolve(outDir), target);
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error(`Unsafe output asset ${path}`);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(resolve(root, path), target);
}
