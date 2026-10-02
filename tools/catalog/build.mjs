import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCards } from './index.mjs';
import { renderPreview } from './preview.mjs';
import { previewAssets, assetPath, copyAsset } from './assets.mjs';
import { buildComponents } from '../build-components.mjs';
import { writeTokenOutputs } from '../tokens/build.mjs';
export async function buildCatalogue({ root, outDir }) {
  if (resolve(root) === resolve(outDir)) throw new Error('Catalogue output must not replace source root');
  const cards = readCards(root);
  const css = writeTokenOutputs({ root });
  await buildComponents({ root, outDir });
  mkdirSync(join(outDir, 'dist'), { recursive: true });
  writeFileSync(join(outDir, 'dist/styles.css'), css.styles);
  const assets = new Set();
  for (const m of css.styles.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) assets.add(assetPath(root, 'dist/styles.css', m[1]));
  for (const card of cards) {
    const html = await renderPreview({ root, card, mode: 'current', standalone: true,
      scope: { theme: 'DEFAULT', appearance: 'light', density: 'cozy' } });
    for (const path of previewAssets(root, card.previewPath, html, ['dist/styles.css','runtime.js','components.js'])) assets.add(path);
    mkdirSync(dirname(join(outDir, card.previewPath)), { recursive: true });
    writeFileSync(join(outDir, card.previewPath), html);
  }
  for (const path of assets) if (path && !['dist/styles.css', 'components/bundle.js', 'components/lib/react.production.min.js', 'components/lib/react-dom.production.min.js'].includes(path.replaceAll('\\','/'))) copyAsset({ root, outDir, path });
  writeFileSync(join(outDir, 'cards.json'), JSON.stringify(cards, null, 2) + '\n');
  for (const file of ['index.html', 'app.js', 'styles.css']) writeFileSync(join(outDir, file), readFileSync(new URL(`../../catalog/${file}`, import.meta.url)));
  return cards;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  console.log(`Catalogue: ${(await buildCatalogue({ root, outDir: join(root, 'site') })).length} cards`);
}
