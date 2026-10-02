import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const guide=read('getting-started.md');
const blocks=[...guide.matchAll(/```ts\s*\n([\s\S]*?)```/g)].map(match=>match[1]);
const documented=blocks.find(block=>block.includes('export const appConfig'));
assert.ok(documented,'guide must show ApplicationConfig');
const normalize=text=>text.replace(/\/\/[^\n]*/g,'').replace(/\s/g,'');
assert.equal(normalize(documented),normalize(read('tests/consumers/angular-base/src/docs-example.ts')),
  'documented bootstrap must match the independently compiled consumer example');
assert.match(read('tests/consumers/angular-base/tsconfig.json'),/src\/\*\*\/\*\.ts/);
console.log('angular-doc-examples: documented bootstrap matches compiled consumer');
