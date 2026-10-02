import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, relative, posix } from 'node:path';
import { parse, parseFragment, serialize } from 'parse5';
import { transform } from 'esbuild';

const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
function setAttr(node, name, value) {
  const found = node.attrs.find(a => a.name === name);
  if (found) found.value = value; else node.attrs.push({ name, value });
}
export async function renderPreview({ root, card, mode = 'legacy', scope }) {
  if (!['legacy', 'current'].includes(mode)) throw new Error(`Unknown preview mode: ${mode}`);
  const doc = parse(readFileSync(join(root, card.previewPath), 'utf8'));
  let head, html;
  const tasks = [];
  const walk = node => {
    if (node.tagName === 'head') head = node;
    if (node.tagName === 'html') html = node;
    if (node.tagName === 'script') {
      const src = attr(node, 'src');
      if (src && /(?:react(?:-dom)?\.production|bundle\.js|babel(?:\.min)?\.js)/.test(src)) { node._remove = true; return; }
      const type = attr(node, 'type') ?? '';
      if (!['', 'text/javascript', 'application/javascript', 'text/babel', 'application/json'].includes(type)) throw new Error(`${card.previewPath}: unsupported script type ${type}`);
      if (type === 'text/babel') tasks.push(transform(node.childNodes.map(n => n.value ?? '').join(''), { loader: 'jsx', jsx: 'transform', sourcefile: card.previewPath }).then(result => {
        node.attrs = node.attrs.filter(a => !['type', 'data-presets'].includes(a.name));
        node.childNodes = [{ nodeName: '#text', value: result.code, parentNode: node }];
      }));
    }
    if (node.tagName === 'link' && attr(node, 'rel') === 'stylesheet' && /(?:tokens(?:\/scoped)?\.css|bundle\.css)/.test(attr(node, 'href') ?? '')) node._remove = true;
    for (const a of node.attrs ?? []) {
      if (!['src', 'href', 'poster'].includes(a.name) || /^(?:data:|blob:|#|mailto:)/.test(a.value)) continue;
      const url = new URL(a.value, `http://aurora.local/${card.previewPath}`);
      if (url.origin !== 'http://aurora.local') {
        if (!node._remove && ['script', 'img', 'link'].includes(node.tagName)) throw new Error(`${card.previewPath}: external resource ${a.value}`);
        continue;
      }
      const path = decodeURIComponent(url.pathname).slice(1);
      if (['script', 'img', 'link'].includes(node.tagName) && !node._remove) {
        if (relative(root, resolve(root, path)).startsWith('..') || !existsSync(join(root, path))) throw new Error(`${card.previewPath}: missing asset ${path}`);
      }
      a.value = url.pathname + url.search + url.hash;
    }
    for (const child of node.childNodes ?? []) walk(child);
    if (node.childNodes) node.childNodes = node.childNodes.filter(n => !n._remove);
  };
  walk(doc);
  await Promise.all(tasks);
  if (scope) for (const [name, value] of Object.entries(scope)) setAttr(html, `data-ds-${name}`, value);
  const scripts = mode === 'legacy'
    ? ['/components/lib/react.production.min.js', '/components/lib/react-dom.production.min.js', '/components/bundle.js']
    : ['/runtime.js', '/components.js'];
  const base = posix.dirname(card.previewPath);
  const injected = parseFragment(`<base href="/${base === '.' ? '' : base + '/'}"><link rel="stylesheet" href="/dist/styles.css">${scripts.map(src => `<script src="${src}"></script>`).join('')}`).childNodes;
  for (const n of injected) n.parentNode = head;
  head.childNodes.unshift(...injected);
  return serialize(doc);
}
