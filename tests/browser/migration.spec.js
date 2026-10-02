import { test, expect } from '@playwright/test';
import { prepareBaseline, captureCards } from '../../tools/baseline/render.mjs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
test('baseline is pinned and renders twice identically offline', async ({ browser }) => {
  test.setTimeout(600000);
  const baseline = await prepareBaseline(root);
  expect(baseline.cards).toHaveLength(69);
  await captureCards({ browser, ...baseline, outDir: `${root}/.tmp/migration/capture-a` });
  await captureCards({ browser, ...baseline, outDir: `${root}/.tmp/migration/capture-b`, compareDir: `${root}/.tmp/migration/capture-a` });
});
