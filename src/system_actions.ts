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

  const keymap2: { [key: string]: number } = {
    space: Key.Space,
    esc: Key.Escape,
    tab: Key.Tab,
    f1: Key.F1,
    f2: Key.F2,
    f3: Key.F3,
    f4: Key.F4,
    f5: Key.F5,
    f6: Key.F6,
    f7: Key.F7,
    f8: Key.F8,
    f9: Key.F9,
    f10: Key.F10,
    f11: Key.F11,
    f12: Key.F12,
    f13: Key.F13,
    f14: Key.F14,
    f15: Key.F15,
    f16: Key.F16,
    f17: Key.F17,
    f18: Key.F18,
    f19: Key.F19,
    f20: Key.F20,
    f21: Key.F21,
    f22: Key.F22,
    f23: Key.F23,
    f24: Key.F24,
    left: Key.Left,
    up: Key.Up,
    right: Key.Right,
    down: Key.Down,
    print: Key.Print,
    pause: Key.Pause,
    insert: Key.Insert,
    delete: Key.Delete,
    home: Key.Home,
    end: Key.End,
    'page up': Key.PageUp,
    'page down': Key.PageDown,
    enter: Key.Enter,
    backspace: Key.Backspace,
  };

  console.log({ s, sk, key: s.key });
  await keyboard.pressKey(...sk);
  if (keymap2[s.key.toLowerCase()] !== undefined) {
    await keyboard.type(keymap2[s.key.toLowerCase()]);
  } else {
    await keyboard.type(s.key);
  }
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
