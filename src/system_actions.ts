import { mouse, Point, straightTo } from '@nut-tree/nut-js';
import { exec, execSync } from 'child_process';
import { screen } from 'electron';
import { Edge, Keys } from './actions';
import { extractKeys, ShortcutKey } from './keyboard';

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

export const mouseToEdge = (edge: Edge) => {
  const size = screen.getPrimaryDisplay().size;
  const target = new Point(
    [Edge.TOP_LEFT, Edge.BOTTOM_LEFT].includes(edge) ? 0 : size.width,
    [Edge.TOP_LEFT, Edge.TOP_RIGHT].includes(edge) ? 0 : size.height
  );
  mouse.config.mouseSpeed = 10000;
  mouse.move(straightTo(target));
};

export const launchApp = (filePath: string) => {
  // 起動まで時間がかかるので、通知だすとかする？
  execSync(`open "${filePath}"`);
};
