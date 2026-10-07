import { test, expect } from '@playwright/test';
import { buildCatalogue } from '../../tools/catalog/build.mjs';
import { serveRoot } from '../../tools/baseline/render.mjs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
test.use({ actionTimeout: 10000 });

test('foundation and map descriptions stay with examples through navigation, comparison and scoped links', async ({ page }, testInfo) => {
  const cards = await buildCatalogue({ root, outDir: `${root}/site` });
  const foundations = cards.filter(card => card.group === '2 · Основы' || ['IconsArrows', 'IconsMapAssets', 'MapTrack'].includes(card.id));
  const served = await serveRoot(`${root}/site`);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
  try {
    await page.goto(served.url + '/index.html?card=DsBreakpoints');
    const description = page.getByRole('article', { name: 'Правила применения' });
    await expect(description).toBeVisible();
    for (const card of foundations) {
      await page.locator(`nav a[data-id="${card.id}"]`).click();
      await expect(description).toBeVisible();
      await expect(description).not.toHaveText('');
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('#reference-links').getByRole('link', { name: 'Описание', exact: true })).toHaveCount(0);
      await expect(page.locator('#preview')).toHaveAttribute('src', new RegExp(card.id));
      await expect(page.locator('#title')).not.toHaveText(/^Ds/);
      await expect(page.locator(`nav a[data-id="${card.id}"]`).locator('xpath=preceding-sibling::h2[1]')).toHaveText(['IconsArrows', 'IconsMapAssets', 'MapTrack'].includes(card.id) ? '5 · Карта' : '2 · Основы');
    }
    await page.locator('nav a[data-id="DsBreakpoints"]').click();
    await page.locator('#theme').selectOption('RED2');
    await page.locator('#appearance').selectOption('dark');
    await page.locator('#density').selectOption('compact');
    await description.getByRole('link', { name: '«Плотность интерфейса»', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#title')).toHaveText('Плотность интерфейса');
    await expect(page.locator('#theme')).toHaveValue('RED2');
    await expect(page.locator('#appearance')).toHaveValue('dark');
    await page.goBack();
    await expect(page.locator('#title')).toHaveText('Адаптивность и брейкпоинты');
    await page.locator('nav a[data-id="DsBrandThemes"]').click();
    await page.frameLocator('#preview').getByRole('link', { name: '«Как выбрать цвета темы»' }).click();
    await expect(page.locator('#title')).toHaveText('Подбор цветов темы');
    await expect(description).toBeVisible();
    await expect(page.locator('#theme')).toHaveValue('RED2');
    await expect(page.locator('#appearance')).toHaveValue('dark');
    await expect(page.locator('#density')).toHaveValue('compact');
    await page.locator('nav a[data-id="IconsArrows"]').click();
    await description.getByRole('link', { name: 'Трек на карте' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#title')).toHaveText('Трек на карте');
    await expect(page.locator('#theme')).toHaveValue('RED2');
    await expect(page.locator('#appearance')).toHaveValue('dark');
    await expect(page.locator('#density')).toHaveValue('compact');
    const zoom = page.frameLocator('#preview').getByRole('slider', { name: 'масштаб карты' });
    await zoom.focus();
    await page.keyboard.press('ArrowRight');
    await expect(zoom).toHaveValue('12.25');
    await expect(page.frameLocator('#preview').locator('#zl')).toHaveText('z 12.25');
    await page.locator('nav a[data-id="overview"]').click();
    await page.frameLocator('#preview').getByRole('link', { name: /Типографика/ }).click();
    await expect(page.locator('#title')).toHaveText('Типографика');
    await expect(page.locator('#theme')).toHaveValue('RED2');
    await expect(page.locator('#appearance')).toHaveValue('dark');
    await expect(page.locator('#density')).toHaveValue('compact');
    await page.locator('nav a[data-id="DsBreakpoints"]').click();
    await page.locator('#compare').click();
    await expect(page.locator('#viewports iframe')).toHaveCount(4);
    await expect(description).toHaveCount(1);
    for (const [index, scope] of [['DEFAULT', 'light', 'cozy'], ['DEFAULT', 'dark', 'compact'], ['RED2', 'light', 'cozy'], ['RED2', 'dark', 'compact']].entries()) {
      const frame = page.frameLocator('#preview-' + index);
      for (const [axis, value] of ['theme', 'appearance', 'density'].map((axis, i) => [axis, scope[i]]))
        await expect(frame.locator('html')).toHaveAttribute('data-ds-' + axis, value);
    }
    for (const id of ['DsType', 'DsHover', 'DsSorting', 'DsSortingMenu', 'DsBrandThemes', 'IconsArrows', 'IconsMapAssets', 'MapTrack']) {
      await page.locator(`nav a[data-id="${id}"]`).click();
      for (let index = 0; index < 4; index++) {
        const frame = page.frameLocator('#preview-' + index);
        await expect.poll(() => frame.locator('body').evaluate(body => {
          const rootStyle = getComputedStyle(document.documentElement);
          const bodyStyle = getComputedStyle(body);
          return ['--ds-fg', '--ds-brand', '--ds-control-h'].every(token => rootStyle.getPropertyValue(token) === bodyStyle.getPropertyValue(token));
        })).toBe(true);
        if (id === 'DsBrandThemes') await expect.poll(() => frame.locator('.hex').first().evaluate(label =>
          label.textContent === getComputedStyle(document.documentElement).getPropertyValue(label.dataset.token).trim()
        )).toBe(true);
      }
    }
    await page.locator('nav a[data-id="DsButton"]').click();
    await expect(description).toBeHidden();
    await expect(page.locator('#reference-links').getByRole('link', { name: 'Описание', exact: true })).toBeVisible();
    await page.goto(served.url + '/index.html?card=missing');
    await expect(description).toBeHidden();
    await page.goto(served.url + '/index.html?card=DsDensity');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: testInfo.outputPath('foundation-light.png'), animations: 'disabled' });
    await page.locator('#appearance').selectOption('dark');
    await page.screenshot({ path: testInfo.outputPath('foundation-dark.png'), animations: 'disabled' });
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(description).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    expect(errors).toEqual([]);
  } finally {
    served.server.closeAllConnections();
    await new Promise(resolve => served.server.close(resolve));
  }
});
