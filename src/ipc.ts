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
  CHANGE_SHORTCUT = 'CHANGE_SHORTCUT',
  CHANGE_TAP_COLOR = 'CHANGE_TAP_COLOR',
}

export interface LaunchpadListener {
  connected: () => void;
  disconnected: () => void;
  onNote: (event: 'down' | 'up', note: number) => void;
}

export interface Setting {
  shortcuts: string[][][];
  bgColors: number[][];
  tapColors: number[][];
}

export type Api = {
  onUpdateMessage: (listener: LaunchpadListener) => void;
  ready: () => Promise<void>;
  loadSetting: () => Promise<Setting>;
  changeShortcut: (x: number, y: number, shortcut: string[]) => Promise<void>;
  changeBgColor: (x: number, y: number, colorIndex: number) => Promise<void>;
  changeTapColor: (x: number, y: number, colorIndex: number) => Promise<void>;
};
