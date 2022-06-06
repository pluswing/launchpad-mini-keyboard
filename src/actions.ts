import { range } from './util';

// action
export type Keys = string[];

export interface Shortcut {
  type: 'shortcut';
  shortcuts: Keys[]; // [["d", "ctrl"], ["a", "shift"]]
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

export interface AppLaunch {
  type: 'applaunch';
  appName: string; // "premiere pro.app"
}

export interface RunCommand {
  type: 'run_command';
  command: string;
}

export type Action = Shortcut | Mouse | AppLaunch | RunCommand;

export const buildAction = (type: string) => {
  let newAct = defaultAction();
  if (type == 'mouse') {
    newAct = { type: 'mouse', edge: Edge.TOP_LEFT } as Mouse;
  }
  if (type == 'applaunch') {
    newAct = { type: 'applaunch', appName: '' } as AppLaunch;
  }
  if (type == 'run_command') {
    newAct = { type: 'run_command', command: '' } as RunCommand;
  }
  return newAct;
};

export const defaultAction = (): Action => {
  return { type: 'shortcut', shortcuts: [[]] };
};

export const actionGrid = (): Action[][] =>
  range(9).map(() => range(9).map(() => defaultAction()));
