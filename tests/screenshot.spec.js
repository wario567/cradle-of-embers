const { test, expect } = require('@playwright/test');

const APP_URL = 'https://wario567.github.io/cradle-of-embers/?seed=cradle-of-embers';

// Wait for the React app to mount and the sector map to appear
async function waitForApp(page) {
  await page.waitForSelector('.app', { timeout: 20000 });
  // Give Babel/React a moment to finish rendering components
  await page.waitForTimeout(2000);
}

test('sector map (home view)', async ({ page }) => {
  await page.goto(APP_URL);
  await waitForApp(page);
  await page.screenshot({ path: 'screenshots/01-sector-map.png', fullPage: false });
});

test('system view', async ({ page }) => {
  await page.goto(APP_URL);
  await waitForApp(page);
  // Force-click a hex position on the sector map (SVG overlay intercepts normally)
  await page.locator('canvas').first().click({ position: { x: 320, y: 280 }, force: true });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'screenshots/02-system-view.png', fullPage: false });
});

test('sidebar nav items visible', async ({ page }) => {
  await page.goto(APP_URL);
  await waitForApp(page);
  await page.screenshot({ path: 'screenshots/03-sidebar.png', fullPage: false, clip: { x: 0, y: 0, width: 240, height: 900 } });
});

test('factions view', async ({ page }) => {
  await page.goto(APP_URL);
  await waitForApp(page);
  await page.locator('.nav-item', { hasText: 'Factions' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/04-factions.png', fullPage: false });
});

test('npcs view', async ({ page }) => {
  await page.goto(APP_URL);
  await waitForApp(page);
  await page.locator('.nav-item', { hasText: 'NPCs' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/05-npcs.png', fullPage: false });
});

test('hooks view', async ({ page }) => {
  await page.goto(APP_URL);
  await waitForApp(page);
  await page.locator('.nav-item', { hasText: 'Hooks' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/06-hooks.png', fullPage: false });
});

test('combat map', async ({ page }) => {
  await page.goto(APP_URL);
  await waitForApp(page);
  await page.locator('.nav-item', { hasText: 'Combat Map' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/07-combat.png', fullPage: false });
});

test('GM mode lock - clicking GM Turn shows password modal', async ({ page }) => {
  await page.goto(APP_URL);
  await waitForApp(page);
  await page.locator('.nav-item', { hasText: 'GM Turn' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'screenshots/08-gm-lock-modal.png', fullPage: false });
});

test('GM mode - unlock and access GM Turn', async ({ page }) => {
  await page.goto(APP_URL);
  await waitForApp(page);

  // First click GM Turn — should show password modal (setup mode since no hash stored)
  await page.locator('.nav-item', { hasText: 'GM Turn' }).click();
  await page.waitForTimeout(400);

  // Fill in password and confirm
  await page.locator('input[type="password"]').first().fill('testpassword');
  await page.locator('#gm-pw2-input').fill('testpassword');
  await page.locator('button', { hasText: 'Set Password' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/09-gm-turn.png', fullPage: false });

  // Verify GM Mode button shows ON
  await expect(page.locator('button', { hasText: 'GM Mode: ON' })).toBeVisible();
});
