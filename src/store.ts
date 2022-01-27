import Store from 'electron-store';
import { Action, defaultAction, Shortcut } from './actions';
import { range } from './util';

const store = new Store({
  migrations: {
    '0.1.0': () => 1,
    '0.2.0': (store) => {
      const shortcuts = store.get('shortcuts') as string[][][];
      if (!shortcuts) {
        return;
      }
      const actions = shortcuts.map((row) => {
        return row.map((item) => {
          // item = ["d", "ctrl"]
          return {
            type: 'shortcut',
            shortcuts: [item],
          } as Shortcut;
        });
      });
      store.set('actions', actions);
    },
  },
});
store.clear();

const ACTIONS = 'actions';
const BG_COLORS = 'bgColors';
const TAP_COLORS = 'tapColors';

export const saveAction = (x: number, y: number, action: Action): void => {
  const v = getActions();
  v[y][x] = action;
  store.set(ACTIONS, v);
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

export const getActions = (): Action[][] => {
  return store.get(ACTIONS, emptyGrid(defaultAction())) as Action[][];
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
