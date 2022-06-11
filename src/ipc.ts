import { Action } from './actions';
import { BackgroundAnimation } from './backgrounds';

declare global {
  interface Window {
    api: Api;
  }
}

export enum IpcKeys {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ON_NOTE = 'ON_NOTE',
  READY = 'READY',
  LOAD_SETTING = 'LOAD_SETTING',
  CHANGE_BG_COLOR = 'CHANGE_BG_COLOR',
  CHANGE_ACTION = 'CHANGE_ACTION',
  CHANGE_TAP_COLOR = 'CHANGE_TAP_COLOR',
  SELECT_FILE = 'SELECT_FILE',
  CHANGE_BG_ANIMATION = 'CHANGE_BG_ANIMATION',
  CHANGE_PAGE = 'CHANGE_PAGE',
  ADD_APPLICATION = 'ADD_APPLICATION',
  REMOVE_APPLICATION = 'REMOVE_APPLICATION',
  SET_CURRENT_APPLICATION = 'SET_CURRENT_APPLICATION',
}

export interface LaunchpadListener {
  connected: () => void;
  disconnected: () => void;
  onNote: (event: 'down' | 'up', note: number) => void;
}

export interface RegisterApplication {
  apppath: string;
  icon: string; // base64
}

export interface Setting {
  // shortcuts: string[][][];
  actions: Action[][];
  bgColors: number[][];
  tapColors: number[][];
  bgAnimation: BackgroundAnimation;
  registerApplications: RegisterApplication[];
}

export type Api = {
  onUpdateMessage: (listener: LaunchpadListener) => void;
  ready: () => Promise<void>;
  loadSetting: () => Promise<Setting>;
  changeAction: (x: number, y: number, action: Action) => Promise<void>;
  changeBgColor: (x: number, y: number, colorIndex: number) => Promise<void>;
  changeTapColor: (x: number, y: number, colorIndex: number) => Promise<void>;
  selectFile: () => Promise<string>;
  changeBgAnimation: (anim: BackgroundAnimation) => Promise<void>;
  changePage: (page: 'global' | 'button') => Promise<void>;
  addApplication: (apppath: string) => Promise<void>;
  removeApplication: (apppath: string) => Promise<void>;
  setCurrentApplication: (apppath: string) => Promise<void>;
};
