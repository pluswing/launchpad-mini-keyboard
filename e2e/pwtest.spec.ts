import { test, expect, _electron, Page, Locator } from '@playwright/test';

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

  const window = await electronApp.firstWindow();

  await tapNote(window, 1, 1);
  await expectShortcut(window, 0, '');
  await inputShortcut(window, 0, 'A');
  await expectShortcut(window, 0, 'A');

  await tapNote(window, 2, 2);
  await expectShortcut(window, 0, '');
  await inputShortcut(window, 0, 'B');
  await expectShortcut(window, 0, 'B');

  await tapNote(window, 1, 1);
  await expectShortcut(window, 0, 'A');

  await tapNote(window, 2, 2);
  await expectShortcut(window, 0, 'B');

  await electronApp.close();

  expect(1).toBe(1);
});

const tapNote = async (page: Page, x: number, y: number): Promise<void> => {
  const index = x + 1 + y * 9;
  await page.click(
    `#root > div > p:nth-child(1) > div > div > div:nth-child(${index})`
  );
};

const shortcutElement = (page: Page, n: number): Locator => {
  return page.locator(
    `#root > div > p:nth-child(2) > div > div:nth-child(${n + 3}) > input`
  );
};

const inputShortcut = async (
  page: Page,
  n: number,
  value: string
): Promise<void> => {
  await shortcutElement(page, n).type(value);
};

const expectShortcut = async (
  page: Page,
  n: number,
  value: string
): Promise<void> => {
  await expect(await shortcutElement(page, n).inputValue()).toBe(value);
};
