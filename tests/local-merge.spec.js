const { test, expect } = require('@playwright/test');

const URL = 'http://127.0.0.1:8099/?seed=cradle-of-embers';

// Collect console errors / page errors for assertion
function trackErrors(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.push('console: ' + m.text()); });
  page.on('pageerror', e => bag.push('pageerror: ' + e.message));
}

async function freshLoad(page) {
  await page.addInitScript(() => { try { localStorage.clear(); } catch {} });
  await page.goto(URL);
  await page.waitForSelector('.intro-overlay', { timeout: 20000 });
  await page.waitForTimeout(1800); // let reveal + babel settle
}

test('intro splash shows both role buttons, no console errors', async ({ page }) => {
  const errs = [];
  trackErrors(page, errs);
  await freshLoad(page);
  await expect(page.locator('button', { hasText: 'Enter as Player' })).toBeVisible();
  await expect(page.locator('button', { hasText: 'Enter as GM' })).toBeVisible();
  await page.screenshot({ path: 'screenshots/m1-intro.png' });
  expect(errs, errs.join('\n')).toEqual([]);
});

test('player role hides GM Tools, shows play views', async ({ page }) => {
  const errs = [];
  trackErrors(page, errs);
  await freshLoad(page);
  await page.locator('button', { hasText: 'Enter as Player' }).click();
  await page.waitForTimeout(1200);
  await expect(page.locator('.app')).toBeVisible();
  // GM Tools section label must be absent
  await expect(page.locator('.nav-label', { hasText: 'GM TOOLS' })).toHaveCount(0);
  await expect(page.locator('.nav-item', { hasText: 'GM Turn' })).toHaveCount(0);
  // Player-facing views present
  await expect(page.locator('.nav-item', { hasText: 'Party' })).toBeVisible();
  await expect(page.locator('.nav-item', { hasText: 'Combat Map' })).toBeVisible();
  await page.screenshot({ path: 'screenshots/m2-player-sidebar.png' });
  expect(errs, errs.join('\n')).toEqual([]);
});

test('GM role: password setup then GM Tools visible', async ({ page }) => {
  const errs = [];
  trackErrors(page, errs);
  await freshLoad(page);
  await page.locator('button', { hasText: 'Enter as GM' }).click();
  await page.waitForTimeout(500);
  // setup modal (no hash stored on fresh load)
  await page.locator('input[type="password"]').first().fill('pw123');
  await page.locator('#gm-pw2-input').fill('pw123');
  await page.locator('button', { hasText: 'Set Password' }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator('.nav-label', { hasText: 'GM TOOLS' })).toBeVisible();
  await expect(page.locator('.nav-item', { hasText: 'GM Turn' })).toBeVisible();
  await page.screenshot({ path: 'screenshots/m3-gm-sidebar.png' });
  expect(errs, errs.join('\n')).toEqual([]);
});

test('character sheet renders and dice roller works', async ({ page }) => {
  const errs = [];
  trackErrors(page, errs);
  await freshLoad(page);
  await page.locator('button', { hasText: 'Enter as Player' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.nav-item', { hasText: 'Party' }).click();
  await page.waitForTimeout(600);
  // Roll a PC so the sheet shows
  const rollBtn = page.locator('button', { hasText: 'ROLL PC' });
  if (await rollBtn.count()) { await rollBtn.first().click(); await page.waitForTimeout(500); }
  await page.screenshot({ path: 'screenshots/m4-character-sheet.png' });
  // Open dice roller via its FAB
  const fab = page.locator('.dice-fab');
  if (await fab.count()) { await fab.first().click(); await page.waitForTimeout(400); }
  await page.screenshot({ path: 'screenshots/m5-dice-roller.png' });
  expect(errs, errs.join('\n')).toEqual([]);
});
