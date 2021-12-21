import Store from 'electron-store';
import { range } from './util';

const store = new Store();
// store.clear();

const SHORTCUTS = 'shortcuts';
const BG_COLORS = 'bgColors';
const TAP_COLORS = 'tapColors';

export const saveShortcut = (
  x: number,
  y: number,
  shortcut: string[]
): void => {
  const v = getShortcuts();
  v[y][x] = shortcut;
  store.set(SHORTCUTS, v);
};

export const saveBgColor = (x: number, y: number, colorIndex: number): void => {
  const v = getBgColors();
  v[y][x] = colorIndex;
  store.set(BG_COLORS, v);
};

export const saveTapColor = (
  x: number,
  y: number,
  colorIndex: number
): void => {
  const v = getTapColors();
  v[y][x] = colorIndex;
  store.set(TAP_COLORS, v);
};

export const getShortcuts = (): string[][][] => {
  return store.get(SHORTCUTS, emptyGrid([] as string[])) as string[][][];
};

export const getBgColors = (): number[][] => {
  return store.get(BG_COLORS, emptyGrid(0)) as number[][];
};

export const getTapColors = (): number[][] => {
  return store.get(TAP_COLORS, emptyGrid(0)) as number[][];
};

const emptyGrid = <T>(value: T): T[][] => {
  return range(9).map(() => range(9).map(() => value));
};
