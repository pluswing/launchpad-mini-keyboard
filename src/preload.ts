import { contextBridge, ipcRenderer } from 'electron';
import { Api, IpcKeys, LaunchpadListener, Setting } from './ipc';

const api: Api = {
  changeShortcut: async (
    x: number,
    y: number,
    shortcut: string[]
  ): Promise<void> => {
    return await ipcRenderer.invoke(IpcKeys.CHANGE_SHORTCUT, x, y, shortcut);
  },
  changeTapColor: async (
    x: number,
    y: number,
    colorIndex: number
  ): Promise<void> => {
    return await ipcRenderer.invoke(IpcKeys.CHANGE_TAP_COLOR, x, y, colorIndex);
  },
  changeBgColor: async (
    x: number,
    y: number,
    colorIndex: number
  ): Promise<void> => {
    return await ipcRenderer.invoke(IpcKeys.CHANGE_BG_COLOR, x, y, colorIndex);
  },
  ready: async (): Promise<void> => {
    return await ipcRenderer.invoke(IpcKeys.READY);
  },
  loadSetting: async (): Promise<Setting> => {
    return await ipcRenderer.invoke(IpcKeys.LOAD_SETTING);
  },
  onUpdateMessage: (listener: LaunchpadListener) => {
    ipcRenderer.removeAllListeners(IpcKeys.CONNECTED);
    ipcRenderer.removeAllListeners(IpcKeys.DISCONNECTED);
    ipcRenderer.removeAllListeners(IpcKeys.ON_NOTE);

    ipcRenderer.on(IpcKeys.CONNECTED, () => {
      listener.connected();
    });
    ipcRenderer.on(IpcKeys.DISCONNECTED, () => {
      listener.disconnected();
    });
    ipcRenderer.on(IpcKeys.ON_NOTE, (_, event, note) => {
      listener.onNote(event, note);
    });
  },
};

contextBridge.exposeInMainWorld('api', api);
