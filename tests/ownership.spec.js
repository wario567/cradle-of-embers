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

test('player builds an owned character via the 4-step builder', async ({ page }) => {
  const errs = []; trackErrors(page, errs);
  await enterAs(page, 'player');
  // Open builder (empty state or roster button)
  await page.locator('button', { hasText: 'Create' }).first().click();
  await page.waitForTimeout(300);
  await expect(page.locator('text=Create your character')).toBeVisible();
  // Step 1
  await page.locator('input[placeholder="e.g. Alex"]').fill('Alex');
  await page.locator('input[placeholder="Name your PC"]').fill('Kira Voss');
  await page.screenshot({ path: 'screenshots/o1-builder-step1.png' });
  await page.locator('button', { hasText: 'Next' }).click();
  // Step 2
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'Next' }).click();
  // Step 3
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'Standard Array' }).click();
  await page.screenshot({ path: 'screenshots/o2-builder-attrs.png' });
  await page.locator('button', { hasText: 'Next' }).click();
  // Step 4
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'screenshots/o3-builder-gear.png' });
  await page.locator('button', { hasText: 'Create character' }).click();
  await page.waitForTimeout(600);
  // Character should appear under MY CHARACTER and be editable (name input enabled)
  await expect(page.locator('.list-item .title', { hasText: 'Kira Voss' })).toBeVisible();
  await expect(page.locator('text=Read-only')).toHaveCount(0);
  await page.screenshot({ path: 'screenshots/o4-my-character.png' });
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
