import { Key, keyboard, mouse, Point, straightTo } from '@nut-tree/nut-js';
import { exec, execSync } from 'child_process';
import { screen } from 'electron';
import { Edge, Keys } from './actions';
import { extractKeys, ShortcutKey } from './keyboard';
import { isMac } from './util';

export const typeKeystroke = async (keys: Keys[]): Promise<void> => {
  for (const s of keys) {
    if (!s.length) return;
    const sc = extractKeys(s);
    if (sc) {
      await typeKeyboard(sc);
    }
    // MEMO delay ...
  }
};

const typeKeyboard = async (s: ShortcutKey): Promise<void> => {
  isMac() ? await typeKeyboardForMac(s) : await typeKeyboardForWindows(s);
};

const typeKeyboardForMac = async (s: ShortcutKey): Promise<void> => {
  const command = `
tell application "System Events"
  keystroke "${s.key}" ${
    s.specialKeys.length
      ? `using {${s.specialKeys.map((k) => `${k} down`).join(',')}}`
      : ''
  }
end tell
`;
  return new Promise((resolve, reject) => {
    const p = exec(`osascript -e '${command}'`);
    p.on('close', () => {
      resolve();
    });
    p.on('error', (err) => {
      reject(err);
    });
  });
};

const typeKeyboardForWindows = async (s: ShortcutKey): Promise<void> => {
  const keymap: { [key: string]: number } = {
    control: Key.LeftControl,
    alt: Key.LeftAlt,
    shift: Key.LeftShift,
    super: Key.LeftSuper,
  };
  const sk = s.specialKeys.map((k) => keymap[k]);
  await keyboard.pressKey(...sk);
  await keyboard.type(s.key);
  await keyboard.releaseKey(...sk);
};

export const mouseToEdge = (edge: Edge) => {
  const { size, scaleFactor } = screen.getPrimaryDisplay();
  const target = new Point(
    [Edge.TOP_LEFT, Edge.BOTTOM_LEFT].includes(edge)
      ? 0
      : size.width * (isMac() ? 1 : scaleFactor),
    [Edge.TOP_LEFT, Edge.TOP_RIGHT].includes(edge)
      ? 0
      : size.height * (isMac() ? 1 : scaleFactor)
  );
  mouse.config.mouseSpeed = isMac() ? 10000 : 1000000;
  mouse.move(straightTo(target));
};

export const launchApp = (filePath: string) => {
  isMac() ? launchAppForMac(filePath) : launchAppForWindows(filePath);
};

export const launchAppForMac = (filePath: string) => {
  // 起動まで時間がかかるので、通知だすとかする？
  execSync(`open "${filePath}"`);
};

export const launchAppForWindows = (filePath: string) => {
  execSync(`"${filePath}"`);
};

export const runCommand = (command: string) => {
  exec(command);
};
