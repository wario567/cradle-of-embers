const { test, expect } = require('@playwright/test');

// Narrow-viewport visual review of the builder + responsive layouts.
// Not part of the green-bar suite — run on demand to screenshot each step.
const URL = 'http://127.0.0.1:8099/?seed=cradle-of-embers';

test.use({ viewport: { width: 390, height: 844 } }); // iPhone-ish portrait

function trackErrors(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.push('console: ' + m.text()); });
  page.on('pageerror', e => bag.push('pageerror: ' + e.message));
}

async function enterAsPlayer(page) {
  await page.addInitScript(() => { try { localStorage.clear(); localStorage.setItem('mp-user-id', 'me-narrow'); } catch {} });
  await page.goto(URL);
  await page.waitForSelector('.intro-overlay', { timeout: 20000 });
  await page.waitForTimeout(1600);
  await page.locator('button', { hasText: 'Enter as Player' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.nav-item', { hasText: 'Party' }).click();
  await page.waitForTimeout(500);
}

const next = page => page.locator('.cb-modal button', { hasText: 'Next' }).click();

test('narrow builder — screenshot every step', async ({ page }) => {
  const errs = []; trackErrors(page, errs);
  await enterAsPlayer(page);
  await page.screenshot({ path: 'screenshots/narrow-00-party.png' });
  await page.locator('button', { hasText: 'Create' }).first().click();
  await page.waitForTimeout(300);

  await page.locator('input[placeholder="e.g. Alex"]').fill('Alex');
  await page.locator('input[placeholder="Name your hero"]').fill('Kira Voss');
  await page.screenshot({ path: 'screenshots/narrow-01-start.png' });
  await next(page);

  await page.locator('.cb-modal button', { hasText: 'Standard Array' }).click();
  await page.screenshot({ path: 'screenshots/narrow-02-attrs.png' });
  await next(page);

  await page.locator('.cb-card', { hasText: 'Soldier' }).click();
  await page.screenshot({ path: 'screenshots/narrow-03-background.png' });
  await next(page);

  await page.screenshot({ path: 'screenshots/narrow-05-skills.png' });
  await page.locator('.cb-freeskill button', { hasText: 'Heal' }).click();
  await next(page);

  await page.locator('.cb-card', { hasText: 'Warrior' }).first().click();
  await page.screenshot({ path: 'screenshots/narrow-04-class.png' });
  await next(page);

  await page.locator('.cb-card', { hasText: 'Sniper' }).click();
  await page.screenshot({ path: 'screenshots/narrow-06-focus.png' });
  await next(page);

  await page.locator('.cb-card', { hasText: 'Soldier' }).first().click();
  await page.screenshot({ path: 'screenshots/narrow-07-gear.png' });
  await next(page);

  await page.locator('input[placeholder*="best pilot"]').fill('Avenge my homeworld');
  await page.screenshot({ path: 'screenshots/narrow-08-review.png' });
  await page.locator('.cb-modal button', { hasText: 'Create character' }).click();
  await page.waitForTimeout(700);

  // Resulting character sheet on a narrow viewport (split pane stacked).
  await page.screenshot({ path: 'screenshots/narrow-09-sheet.png', fullPage: true });
  expect(errs, errs.join('\n')).toEqual([]);
});
