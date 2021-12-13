import { contextBridge, ipcRenderer } from 'electron';
import { Api, IpcKeys, LaunchpadListener } from './ipc';

const api: Api = {
  sendMessage: async (arg: string): Promise<string> => {
    return await ipcRenderer.invoke(IpcKeys.AAA, arg);
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
