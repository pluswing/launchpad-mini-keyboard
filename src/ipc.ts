declare global {
  interface Window {
    api: Api;
  }
}

export enum IpcKeys {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  CHANGE_BG_COLOR = 'CHANGE_BG_COLOR',
  LISTEN_FOR_SETTING = 'LISTEN_FOR_SETTING',
  ON_NOTE = 'ON_NOTE',
}

export interface LaunchpadListener {
  connected: () => void;
  disconnected: () => void;
  onNote: (event: 'down' | 'up', note: number) => void;
}

export type Api = {
  changeBgColor: (colorIndex: number) => Promise<void>;
  listenForSetting: () => Promise<void>;
  onUpdateMessage: (listener: LaunchpadListener) => void;
};
