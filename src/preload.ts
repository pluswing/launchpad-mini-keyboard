import { contextBridge, ipcRenderer } from 'electron';
import { Api, IpcKeys, LaunchpadListener } from './ipc';

const api: Api = {
  changeBgColor: async (colorIndex: number): Promise<void> => {
    return await ipcRenderer.invoke(IpcKeys.CHANGE_BG_COLOR, colorIndex);
  },
  onUpdateMessage: (listener: LaunchpadListener) => {
    ipcRenderer.removeAllListeners(IpcKeys.CONNECTED);
    ipcRenderer.removeAllListeners(IpcKeys.DISCONNECTED);

    ipcRenderer.on(IpcKeys.CONNECTED, () => {
      listener.connected();
    });
    ipcRenderer.on(IpcKeys.DISCONNECTED, () => {
      listener.disconnected();
    });
  },
};

contextBridge.exposeInMainWorld('api', api);
