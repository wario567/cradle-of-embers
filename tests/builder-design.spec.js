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

test('rolled attributes let you raise exactly one score to 14 (SWN p.4 step 1)', async ({ page }) => {
  const errs = []; trackErrors(page, errs);
  await openBuilder(page);
  const modal = page.locator('.cb-modal');
  await page.locator('input[placeholder="Name your hero"]').fill('Simon');
  await next(page);

  // Array mode: no swap affordance.
  await page.locator('.cb-modal button', { hasText: 'Standard Array' }).click();
  await expect(page.locator('.cb-swap-hint')).toHaveCount(0);

  // Roll: the swap hint appears and cards become swappable.
  await page.locator('.cb-modal button', { hasText: 'Roll 3d6' }).click();
  await page.waitForTimeout(150);
  await expect(page.locator('.cb-swap-hint')).toBeVisible();
  await modal.screenshot({ path: 'screenshots/design-04-rolled-hint.png' });

  // Raising the first attribute sets it to exactly 14, and only one card is flagged.
  const cards = page.locator('.cb-attr');
  await cards.nth(0).click();
  await page.waitForTimeout(100);
  await expect(cards.nth(0).locator('.cb-attr-score')).toHaveValue('14');
  await expect(page.locator('.cb-attr.swapped')).toHaveCount(1);
  await modal.screenshot({ path: 'screenshots/design-05-raised-14.png' });

  // Moving the raise to another attribute keeps it to a single 14 swap.
  await cards.nth(2).click();
  await page.waitForTimeout(100);
  await expect(cards.nth(2).locator('.cb-attr-score')).toHaveValue('14');
  await expect(page.locator('.cb-attr.swapped')).toHaveCount(1);

  // Clicking it again undoes the raise.
  await cards.nth(2).click();
  await page.waitForTimeout(100);
  await expect(page.locator('.cb-attr.swapped')).toHaveCount(0);
  expect(errs, errs.join('\n')).toEqual([]);
});

test('Warrior gets a free combat focus (step 7) and a free skill (step 9)', async ({ page }) => {
  const errs = []; trackErrors(page, errs);
  await openBuilder(page);
  await page.locator('input[placeholder="Name your hero"]').fill('Dax');
  await next(page);                                          // attrs
  await next(page);                                          // background
  await page.locator('.cb-card', { hasText: 'Soldier' }).click();
  await next(page);                                          // class
  await page.locator('.cb-card', { hasText: 'Warrior' }).first().click();
  await next(page);                                          // skills

  // Step 9 free skill is required to advance.
  await expect(page.locator('.cb-modal button', { hasText: 'Next' })).toHaveCount(1);
  await page.locator('.cb-freeskill button', { hasText: 'Program' }).click();
  await page.locator('.cb-modal').screenshot({ path: 'screenshots/design-06-freeskill.png' });
  await next(page);                                          // focus

  // Primary focus + the Warrior's free combat focus selector both present.
  await page.locator('.cb-card', { hasText: 'Alert' }).click(); // primary = Alert (combat)
  await expect(page.locator('#cb-combat-focus')).toBeVisible();
  await page.locator('.cb-modal').screenshot({ path: 'screenshots/design-07-bonusfocus.png' });
  await page.locator('#cb-combat-focus').selectOption('Sniper'); // free combat focus = Sniper
  await next(page);                                          // gear
  await page.locator('.cb-card', { hasText: 'Soldier' }).first().click();
  await next(page);                                          // review

  // Review lists both foci and the free skill, then create.
  await expect(page.locator('.cb-modal')).toContainText('Alert');
  await expect(page.locator('.cb-modal')).toContainText('Sniper');
  await expect(page.locator('.cb-modal')).toContainText('Program');
  await page.locator('.cb-modal button', { hasText: 'Create character' }).click();
  await page.waitForTimeout(700);

  // The created sheet carries both foci (Foci panel is far down — scroll to it).
  await page.locator('.list-item .title', { hasText: 'Dax' }).click();
  await page.waitForTimeout(300);
  const fociPanel = page.locator('.panel', { has: page.locator('.panel-title', { hasText: 'Foci' }) });
  await fociPanel.scrollIntoViewIfNeeded();
  await expect(fociPanel).toContainText('Alert');
  await expect(fociPanel).toContainText('Sniper');
  expect(errs, errs.join('\n')).toEqual([]);
});
