declare global {
  interface Window {
    api: Api;
  }
}

export enum IpcKeys {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  CHANGE_BG_COLOR = 'CHANGE_BG_COLOR',
}

export interface LaunchpadListener {
  connected: () => void;
  disconnected: () => void;
}

export type Api = {
  changeBgColor: (colorIndex: number) => Promise<void>;
  onUpdateMessage: (listener: LaunchpadListener) => void;
};
