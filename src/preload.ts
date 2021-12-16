import { contextBridge, ipcRenderer } from 'electron';
import { Api, IpcKeys, LaunchpadListener } from './ipc';

const api: Api = {
  changeBgColor: async (colorIndex: number): Promise<void> => {
    return await ipcRenderer.invoke(IpcKeys.CHANGE_BG_COLOR, colorIndex);
  },
  listenForSetting: async (): Promise<void> => {
    return await ipcRenderer.invoke(IpcKeys.LISTEN_FOR_SETTING);
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
