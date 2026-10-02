/** Собирает пакет из канонических исходников, сохраняя прежний buildDist API. */
import { fileURLToPath } from 'node:url';
import { buildTokens, writeTokenOutputs } from './tokens/build.mjs';
export function buildDist({root = fileURLToPath(new URL('..', import.meta.url))} = {}) {
  const {styles, tokens} = buildTokens({root});
  return {styles, tokens};
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const {styles,tokens} = writeTokenOutputs({root});
  console.log(`dist/styles.css ${styles.length} bytes; dist/tokens.css ${tokens.length} bytes`);
}
