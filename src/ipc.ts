declare global {
  interface Window {
    api: Api;
  }
}

export enum IpcKeys {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  // for test
  AAA = 'AAA',
  BBB = 'BBB',
}

export interface LaunchpadListener {
  connected: () => void;
  disconnected: () => void;
}

export type Api = {
  sendMessage: (arg: string) => Promise<string>;
  onUpdateMessage: (listener: LaunchpadListener) => void;
};
