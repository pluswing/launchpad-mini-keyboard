import { mouse, Point, straightTo } from '@nut-tree/nut-js';
import { execSync } from 'child_process';
import { screen } from 'electron';
import { Edge } from './actions';
import { ShortcutKey } from './keyboard';

export const typeKeyboard = (s: ShortcutKey): void => {
  const command = `
tell application "System Events"
  keystroke "${s.key}" ${
    s.specialKeys.length
      ? `using {${s.specialKeys.map((k) => `${k} down`).join(',')}}`
      : ''
  }
end tell
`;
  execSync(`osascript -e '${command}'`);
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
