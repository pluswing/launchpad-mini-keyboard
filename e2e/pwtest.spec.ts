import {
  test,
  expect,
  _electron,
  Page,
  Locator,
  ElectronApplication,
} from '@playwright/test';
import { exec } from 'child_process';

test.describe('e2e', () => {
  let electronApp: ElectronApplication;
  let window: Page;

  test.beforeAll(async () => {
    const run = async (command: string) => {
      return new Promise<void>((resolve) => {
        const p = exec(command);
        p.stdout?.on('data', (data) => {
          console.log(data);
        });
        p.on('exit', () => {
          resolve();
        });
      });
    };
    // await run('npm run dev:tsc');
    // await run('npm run dev:webpack');
    // await run('npm run copy:assets');
  });

  test.beforeEach(async () => {
    electronApp = await _electron.launch({
      args: ['dist/main.js', '--autoopen'],
    });

    window = await electronApp.firstWindow();
  });

  test.afterEach(async () => {
    await electronApp.close();
  });

  test('senario 01', async () => {
    await tapNote(1, 1);
    await expect(shortcut(0)).toHaveValue('');
    await shortcut(0).type('A');
    await expect(shortcut(0)).toHaveValue('A');

    await tapNote(2, 2);
    await expect(shortcut(0)).toHaveValue('');
    await shortcut(0).type('B');
    await expect(shortcut(0)).toHaveValue('B');

    await tapNote(1, 1);
    await expect(shortcut(0)).toHaveValue('A');

    await tapNote(2, 2);
    await expect(shortcut(0)).toHaveValue('B');
  });

  // test('senario 02', async () => {
  // });

  const tapNote = async (x: number, y: number): Promise<void> => {
    const index = x + 1 + y * 9;
    await window.click(
      `#root > div > p:nth-child(1) > div > div > div:nth-child(${index})`
    );
  };

  const shortcut = (n: number): Locator => {
    return window.locator(
      `#root > div > p:nth-child(2) > div > div:nth-child(${n + 3}) > input`
    );
  };

  const changeGlobalTab = async (): Promise<void> => {
    // TODO implements
  };

  const changeButtonTab = async (): Promise<void> => {
    // TODO implements
  };

  const changeShortcutMode = async (): Promise<void> => {
    // TODO implements
  };

  const changeMouseMode = async (): Promise<void> => {
    // TODO implements
  };

  const changeLanchAppMode = async (): Promise<void> => {
    // TODO implements
  };

  const changeMouseCorner = async (): Promise<void> => {
    // TODO implements
  };

  const setLaunchApp = async (): Promise<void> => {
    // TODO implements
  };

  const changeBgColor = async (): Promise<void> => {
    // TODO implements
  };

  const changeTapColor = async (): Promise<void> => {
    // TODO implements
  };

  const addShortcut = async (): Promise<void> => {
    // TODO implements
  };
  const removeShortcut = async (n: number): Promise<void> => {
    // TODO implements
  };

  const addApplication = async (apppath: string): Promise<void> => {
    // TODO implements
  };

  const removeApplication = async (): Promise<void> => {
    // TODO implements
  };

  const changeApplication = async (apppath: string): Promise<void> => {
    // TODO implements
  };

  const changeBgAnimtionType = async (type: string): Promise<void> => {
    // TODO implements
  };

  const changeBgAnimationSlider = async (
    type: string,
    value: number
  ): Promise<void> => {
    // TODO implements
  };
  // ....
});
