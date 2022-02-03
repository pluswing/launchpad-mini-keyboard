import { mouse, Point, straightTo } from '@nut-tree/nut-js';
import { execSync } from 'child_process';
import { screen } from 'electron';
import { Edge } from './actions';

export const mouseToEdge = (edge: Edge) => {
  const size = screen.getPrimaryDisplay().size;
  const target = new Point(
    Edge.TOP_LEFT == edge || Edge.BOTTOM_LEFT == edge ? 0 : size.width,
    Edge.TOP_LEFT == edge || Edge.TOP_RIGHT == edge ? 0 : size.height
  );
  mouse.config.mouseSpeed = 10000;
  mouse.move(straightTo(target));
};

export const launchApp = (filePath: string) => {
  execSync(`open "${filePath}"`);
};
