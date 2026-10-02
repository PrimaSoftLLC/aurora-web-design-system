/** Собирает пакет из канонических исходников, сохраняя прежний buildDist API. */
import { fileURLToPath } from 'node:url';
import { buildTokens, writeTokenOutputs } from './tokens/build.mjs';
import { buildComponents } from './build-components.mjs';
import { join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { buildCatalogue } from './catalog/build.mjs';
export function buildDist({root = fileURLToPath(new URL('..', import.meta.url))} = {}) {
  const {styles, tokens} = buildTokens({root});
  return {styles, tokens};
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const {styles,tokens} = writeTokenOutputs({root});
  const components = await buildComponents({root,outDir:join(root,'.tmp/runtime')});
  writeFileSync(join(root,'components/bundle.js'),readFileSync(components.components));
  const cards = await buildCatalogue({root,outDir:join(root,'site')});
  console.log(`dist/styles.css ${styles.length} bytes; dist/tokens.css ${tokens.length} bytes`);
  console.log(`Catalogue: ${cards.length} cards`);
}
