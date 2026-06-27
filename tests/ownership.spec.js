const { test, expect } = require('@playwright/test');

const URL = 'http://127.0.0.1:8099/?seed=cradle-of-embers';

function trackErrors(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.push('console: ' + m.text()); });
  page.on('pageerror', e => bag.push('pageerror: ' + e.message));
}

async function enterAs(page, role, { seedParty } = {}) {
  await page.addInitScript((sp) => {
    try {
      localStorage.clear();
      localStorage.setItem('mp-user-id', 'me-123');
      if (sp) localStorage.setItem('swn-campaign-cradle-of-embers', JSON.stringify(sp));
    } catch {}
  }, seedParty);
  await page.goto(URL);
  await page.waitForSelector('.intro-overlay', { timeout: 20000 });
  await page.waitForTimeout(1600);
  if (role === 'player') {
    await page.locator('button', { hasText: 'Enter as Player' }).click();
  } else {
    await page.locator('button', { hasText: 'Enter as GM' }).click();
    await page.waitForTimeout(400);
    await page.locator('input[type="password"]').first().fill('pw');
    await page.locator('#gm-pw2-input').fill('pw');
    await page.locator('button', { hasText: 'Set Password' }).click();
  }
  await page.waitForTimeout(1000);
  await page.locator('.nav-item', { hasText: 'Party' }).click();
  await page.waitForTimeout(600);
}

test('a builder-created character is owned by and editable for its player', async ({ page }) => {
  const errs = []; trackErrors(page, errs);
  await enterAs(page, 'player');
  await page.locator('button', { hasText: 'Create' }).first().click();
  await page.waitForTimeout(300);
  const next = () => page.locator('.cb-modal button', { hasText: 'Next' }).click();
  await page.locator('input[placeholder="Name your hero"]').fill('Kira Voss');
  await next();                                                   // attrs
  await next();                                                   // background
  await page.locator('.cb-card', { hasText: 'Soldier' }).click();
  await next();                                                   // skills
  await page.locator('.cb-freeskill button', { hasText: 'Heal' }).click(); // step 9 free skill
  await next();                                                   // class
  await page.locator('.cb-card', { hasText: 'Warrior' }).first().click();
  await next();                                                   // focus
  await page.locator('.cb-card', { hasText: 'Sniper' }).click();
  await next();                                                   // gear
  await page.locator('.cb-card', { hasText: 'Soldier' }).first().click();
  await next();                                                   // review
  await page.locator('.cb-modal button', { hasText: 'Create character' }).click();
  await page.waitForTimeout(700);
  await expect(page.locator('.list-item .title', { hasText: 'Kira Voss' })).toBeVisible();
  await expect(page.locator('text=🔒 Read-only')).toHaveCount(0);
  expect(errs, errs.join('\n')).toEqual([]);
});

test('foreign-owned character is read-only for a player', async ({ page }) => {
  const errs = []; trackErrors(page, errs);
  const seedParty = {
    party: [{
      id: 'pc-foreign', name: 'Renn Solari', class: 'Expert', background: 'Spacer',
      level: 1, xp: 0, attrs: { STR: 10, DEX: 12, CON: 10, INT: 13, WIS: 11, CHA: 10 },
      hp: 6, maxHp: 6, bab: 0, armor: 'None', ac: 11,
      saves: { physical: 15, evasion: 14, mental: 14 }, systemStrain: 0,
      skills: [], foci: [], weapons: [], gear: [], credits: 200, notes: '',
      ownerId: 'someone-else', ownerName: 'Sam',
    }],
    missions: [], encounters: [], gmLog: [],
  };
  await enterAs(page, 'player', { seedParty });
  await page.locator('.list-item .title', { hasText: 'Renn Solari' }).click();
  await page.waitForTimeout(400);
  await expect(page.locator('text=🔒 Read-only')).toBeVisible();
  // Name input inside the read-only wrapper should not be editable (pointer-events none)
  await page.screenshot({ path: 'screenshots/o5-readonly.png' });
  expect(errs, errs.join('\n')).toEqual([]);
});

test('GM can edit any character (no read-only banner)', async ({ page }) => {
  const errs = []; trackErrors(page, errs);
  const seedParty = {
    party: [{
      id: 'pc-foreign', name: 'Renn Solari', class: 'Expert', background: 'Spacer',
      level: 1, xp: 0, attrs: { STR: 10, DEX: 12, CON: 10, INT: 13, WIS: 11, CHA: 10 },
      hp: 6, maxHp: 6, bab: 0, armor: 'None', ac: 11,
      saves: { physical: 15, evasion: 14, mental: 14 }, systemStrain: 0,
      skills: [], foci: [], weapons: [], gear: [], credits: 200, notes: '',
      ownerId: 'someone-else', ownerName: 'Sam',
    }],
    missions: [], encounters: [], gmLog: [],
  };
  await enterAs(page, 'gm', { seedParty });
  await page.locator('.list-item .title', { hasText: 'Renn Solari' }).click();
  await page.waitForTimeout(400);
  await expect(page.locator('text=Read-only')).toHaveCount(0);
  await page.screenshot({ path: 'screenshots/o6-gm-edits-all.png' });
  expect(errs, errs.join('\n')).toEqual([]);
});
