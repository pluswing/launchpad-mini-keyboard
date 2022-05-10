import { test, expect, _electron } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  const title = page.locator('.navbar__inner .navbar__title');
  await expect(title).toHaveText('Playwright');
});

test('electron test', async () => {
  // dev:tsc, dev:webpack, copy:assets
  const electronApp = await _electron.launch({
    args: ['dist/main.js', '--autoopen'],
  });
  const appPath = await electronApp.evaluate(async ({ app }) => {
    return app.getAppPath();
  });
  console.log(appPath);

  const window = await electronApp.firstWindow();
  console.log(await window.title());
  // await window.screenshot({ path: 'intro.png' });
  window.on('console', console.log);
  // await window.click('text=Click me');
  await electronApp.close();

  expect(1).toBe(1);
});
