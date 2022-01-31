import { Action } from './actions';

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
  ENTER_SELECTING_COLOR = 'ENTER_SELECTING_COLOR',
  LEAVE_SELECTING_COLOR = 'LEAVE_SELECTING_COLOR',
  CHANGE_SELECTING_COLOR_PAGE = 'CHANGE_SELECTING_COLOR_PAGE',
  FILE_SELECT = 'FILE_SELECT',
}

export interface LaunchpadListener {
  connected: () => void;
  disconnected: () => void;
  onNote: (event: 'down' | 'up', note: number) => void;
}

export interface Setting {
  // shortcuts: string[][][];
  actions: Action[][];
  bgColors: number[][];
  tapColors: number[][];
}

export type Api = {
  onUpdateMessage: (listener: LaunchpadListener) => void;
  ready: () => Promise<void>;
  loadSetting: () => Promise<Setting>;
  changeAction: (x: number, y: number, action: Action) => Promise<void>;
  changeBgColor: (x: number, y: number, colorIndex: number) => Promise<void>;
  changeTapColor: (x: number, y: number, colorIndex: number) => Promise<void>;
  enterSelectingColor: () => Promise<void>;
  leaveSelectingColor: () => Promise<void>;
  changeSelectingColorPage: (page: number) => Promise<void>;
  fileSelect: () => Promise<string>;
};
