import Store from 'electron-store';
import { Action, defaultAction, Shortcut } from './actions';
import { BackgroundAnimation, noneAnimation } from './backgrounds';
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

      const bgColors = (store.get('bgColors') as number[][]).map((line) =>
        line.map((v) => (v >= 28 ? 0 : v))
      );
      store.set('bgColors', bgColors);

      const tapColors = (store.get('tapColors') as number[][]).map((line) =>
        line.map((v) => (v >= 28 ? 0 : v))
      );
      store.set('tapColors', tapColors);
    },
  },
});
// store.clear();

const ACTIONS = 'actions';
const BG_COLORS = 'bgColors';
const TAP_COLORS = 'tapColors';
const BG_ANIMATION = 'bgAnimation';

export const saveAction = (x: number, y: number, action: Action): void => {
  const v = getActions();
  v[y][x] = action;
  store.set(ACTIONS, v);
};

export const getActions = (): Action[][] => {
  return store.get(ACTIONS, emptyGrid(defaultAction())) as Action[][];
};

export const saveBgColor = (x: number, y: number, colorIndex: number): void => {
  const v = getBgColors();
  v[y][x] = colorIndex;
  store.set(BG_COLORS, v);
};

export const getBgColors = (): number[][] => {
  return store.get(BG_COLORS, emptyGrid(0)) as number[][];
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

export const getTapColors = (): number[][] => {
  return store.get(TAP_COLORS, emptyGrid(0)) as number[][];
};

export const saveBgAnimation = (anim: BackgroundAnimation): void => {
  store.set(BG_ANIMATION, anim);
};

export const getBgAnimation = (): BackgroundAnimation => {
  return store.get(BG_ANIMATION, noneAnimation()) as BackgroundAnimation;
};

const emptyGrid = <T>(value: T): T[][] => {
  return range(9).map(() =>
    range(9).map(() => {
      if (typeof value == 'object') {
        return JSON.parse(JSON.stringify(value));
      }
      return value;
    })
  );
};
