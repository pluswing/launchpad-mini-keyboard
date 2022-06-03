import { range } from './util';

// action
export type Keys = string[];

export interface Shortcut {
  type: 'shortcut';
  shortcuts: Keys[]; // [["d", "ctrl"], ["a", "shift"]]
}

export interface AppLaunch {
  type: 'applaunch';
  appName: string; // "premiere pro.app"
}

export enum Edge {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}

export interface Mouse {
  type: 'mouse';
  edge: Edge;
}

export type Action = Shortcut | AppLaunch | Mouse;

export const buildAction = (type: string) => {
  let newAct = defaultAction();
  if (type == 'mouse') {
    newAct = { type: 'mouse', edge: Edge.TOP_LEFT } as Mouse;
  }
  if (type == 'applaunch') {
    newAct = { type: 'applaunch', appName: '' } as AppLaunch;
  }
  return newAct;
};

export const defaultAction = (): Action => {
  return { type: 'shortcut', shortcuts: [[]] };
};

export const actionGrid = (): Action[][] =>
  range(9).map(() => range(9).map(() => defaultAction()));