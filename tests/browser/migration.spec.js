import { test, expect } from '@playwright/test';
import { prepareBaseline, captureCards } from '../../tools/baseline/render.mjs';
import { fileURLToPath } from 'node:url';
import {buildAll} from '../../tools/build.js';
import{readFileSync,writeFileSync,mkdirSync}from'node:fs';
const root = fileURLToPath(new URL('../../', import.meta.url));
test('baseline is pinned and renders twice identically offline', async ({ browser }) => {
  test.setTimeout(600000);
  const baseline = await prepareBaseline(root);
  expect(baseline.cards).toHaveLength(69);
  await captureCards({ browser, ...baseline, outDir: `${root}/.tmp/migration/capture-a` });
  await captureCards({ browser, ...baseline, outDir: `${root}/.tmp/migration/capture-b`, compareDir: `${root}/.tmp/migration/capture-a` });
});
test('full migration preserves all 69 pages in four scopes',async({browser})=>{
 test.setTimeout(600000);
 const baseline=await prepareBaseline(root);
 await captureCards({browser,...baseline,outDir:`${root}/.tmp/migration/full-old`});
 await buildAll({root});
 mkdirSync(`${root}/site/tests/fixtures`,{recursive:true});writeFileSync(`${root}/site/tests/fixtures/cascade.html`,readFileSync(`${baseline.root}/tests/fixtures/cascade.html`));
 await captureCards({browser,root:`${root}/site`,cards:baseline.cards,mode:'current',outDir:`${root}/.tmp/migration/full-new`,compareDir:`${root}/.tmp/migration/full-old`});
});
