const { test, expect } = require('@playwright/test');

// Design-review screenshots of the redesigned builder modal at desktop width.
const URL = 'http://127.0.0.1:8099/?seed=cradle-of-embers';

function trackErrors(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.push('console: ' + m.text()); });
  page.on('pageerror', e => bag.push('pageerror: ' + e.message));
}

async function openBuilder(page) {
  await page.addInitScript(() => { try { localStorage.clear(); localStorage.setItem('mp-user-id', 'me-design'); } catch {} });
  await page.goto(URL);
  await page.waitForSelector('.intro-overlay', { timeout: 20000 });
  await page.waitForTimeout(1600);
  await page.locator('button', { hasText: 'Enter as Player' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.nav-item', { hasText: 'Party' }).click();
  await page.waitForTimeout(500);
  await page.locator('button', { hasText: 'Create' }).first().click();
  await page.waitForTimeout(300);
}
const next = page => page.locator('.cb-modal button', { hasText: 'Next' }).click();

test('redesigned builder — modal close-ups', async ({ page }) => {
  const errs = []; trackErrors(page, errs);
  await openBuilder(page);
  const modal = page.locator('.cb-modal');

  await page.locator('input[placeholder="Name your hero"]').fill('Kira Voss');
  await modal.screenshot({ path: 'screenshots/design-01-start.png' });
  await next(page);

  await page.locator('.cb-modal button', { hasText: 'Standard Array' }).click();
  await page.waitForTimeout(150);
  await modal.screenshot({ path: 'screenshots/design-02-attrs.png' });

  await page.locator('.cb-modal button', { hasText: 'Roll 3d6' }).click();
  await page.waitForTimeout(150);
  await modal.screenshot({ path: 'screenshots/design-02b-attrs-rolled.png' });
  await next(page);

  await page.locator('.cb-card', { hasText: 'Soldier' }).click();
  await modal.screenshot({ path: 'screenshots/design-03-background.png' });

  expect(errs, errs.join('\n')).toEqual([]);
});
