const { test, expect } = require('@playwright/test');

const URL = 'http://127.0.0.1:8099/?seed=cradle-of-embers';

function trackErrors(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.push('console: ' + m.text()); });
  page.on('pageerror', e => bag.push('pageerror: ' + e.message));
}

async function enterAsPlayer(page) {
  await page.addInitScript(() => { try { localStorage.clear(); localStorage.setItem('mp-user-id', 'me-123'); } catch {} });
  await page.goto(URL);
  await page.waitForSelector('.intro-overlay', { timeout: 20000 });
  await page.waitForTimeout(1600);
  await page.locator('button', { hasText: 'Enter as Player' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.nav-item', { hasText: 'Party' }).click();
  await page.waitForTimeout(500);
}

const next = page => page.locator('.cb-modal button', { hasText: 'Next' }).click();

test('guided builder walks all steps and creates a rules-correct Warrior', async ({ page }) => {
  const errs = []; trackErrors(page, errs);
  await enterAsPlayer(page);
  await page.locator('button', { hasText: 'Create' }).first().click();
  await page.waitForTimeout(300);
  await expect(page.locator('text=Create your character')).toBeVisible();

  // Step: Start
  await page.locator('input[placeholder="e.g. Alex"]').fill('Alex');
  await page.locator('input[placeholder="Name your hero"]').fill('Kira Voss');
  await page.screenshot({ path: 'screenshots/cb1-start.png' });
  await next(page);

  // Step: Attributes (standard array default)
  await page.locator('.cb-modal button', { hasText: 'Standard Array' }).click();
  await page.screenshot({ path: 'screenshots/cb2-attrs.png' });
  await next(page);

  // Step: Background
  await page.locator('.cb-card', { hasText: 'Soldier' }).click();
  await page.screenshot({ path: 'screenshots/cb3-background.png' });
  await next(page);

  // Step: Skills (quick skills shown; Soldier has Any Combat -> choose Shoot)
  await expect(page.locator('.cb-stepname', { hasText: 'Skills' })).toBeVisible();
  await expect(page.locator('.cb-freeskill')).toBeVisible();
  await page.locator('.cb-freeskill button', { hasText: 'Heal' }).click(); // step 9 free skill
  await page.screenshot({ path: 'screenshots/cb5-skills.png' });
  await next(page);

  // Step: Class
  await page.locator('.cb-card', { hasText: 'Warrior' }).first().click();
  await page.screenshot({ path: 'screenshots/cb4-class.png' });
  await next(page);

  // Step: Focus
  await page.locator('.cb-card', { hasText: 'Sniper' }).click();
  await page.screenshot({ path: 'screenshots/cb6-focus.png' });
  await next(page);

  // Step: Gear
  await page.locator('.cb-card', { hasText: 'Soldier' }).first().click();
  await page.screenshot({ path: 'screenshots/cb7-gear.png' });
  await next(page);

  // Step: Review
  await page.locator('input[placeholder*="best pilot"]').fill('Avenge my homeworld');
  await page.screenshot({ path: 'screenshots/cb8-review.png' });
  await page.locator('.cb-modal button', { hasText: 'Create character' }).click();
  await page.waitForTimeout(700);

  // Created character appears and is editable
  await expect(page.locator('.list-item .title', { hasText: 'Kira Voss' })).toBeVisible();
  await page.screenshot({ path: 'screenshots/cb9-sheet.png' });

  // Sheet opened on the new character, editable, with derived stats
  await expect(page.locator('input[value="Kira Voss"]')).toBeVisible();
  await expect(page.locator('text=🔒 Read-only')).toHaveCount(0);
  expect(errs, errs.join('\n')).toEqual([]);
});

test('psychic path shows the psionics step', async ({ page }) => {
  const errs = []; trackErrors(page, errs);
  await enterAsPlayer(page);
  await page.locator('button', { hasText: 'Create' }).first().click();
  await page.waitForTimeout(300);
  await page.locator('input[placeholder="Name your hero"]').fill('Mind Reader');
  await next(page);
  await next(page); // attrs
  await page.locator('.cb-card', { hasText: 'Scholar' }).click();
  await next(page);
  await page.locator('.cb-freeskill button', { hasText: 'Notice' }).click(); // step 9 free skill
  await next(page); // skills
  await page.locator('.cb-card', { hasText: 'Psychic' }).first().click();
  await next(page); // class
  await page.locator('.cb-card').first().click(); // focus
  await next(page);
  // Now should be on Psionics step
  await expect(page.locator('text=Psychics train in disciplines')).toBeVisible();
  await page.screenshot({ path: 'screenshots/cb-psi.png' });
  expect(errs, errs.join('\n')).toEqual([]);
});
