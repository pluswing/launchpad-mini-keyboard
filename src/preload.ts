import { contextBridge, ipcRenderer } from 'electron';
import { Action } from './actions';
import { BackgroundAnimation } from './backgrounds';
import { Api, IpcKeys, LaunchpadListener, Setting } from './ipc';

const api: Api = {
  changeAction: async (x: number, y: number, action: Action): Promise<void> => {
    return await ipcRenderer.invoke(IpcKeys.CHANGE_ACTION, x, y, action);
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
  selectFile: async () => {
    return await ipcRenderer.invoke(IpcKeys.SELECT_FILE);
  },
  changeBgAnimation: async (anim: BackgroundAnimation) => {
    return await ipcRenderer.invoke(IpcKeys.CHANGE_BG_ANIMATION, anim);
  },
  changePage: async (page: 'global' | 'button') => {
    return await ipcRenderer.invoke(IpcKeys.CHANGE_PAGE, page);
  },
  addApplication: async (apppath: string) => {
    return await ipcRenderer.invoke(IpcKeys.ADD_APPLICATION, apppath);
  },
  removeApplication: async (apppath: string) => {
    return await ipcRenderer.invoke(IpcKeys.REMOVE_APPLICATION, apppath);
  },
  setCurrentApplication: async (apppath: string) => {
    return await ipcRenderer.invoke(IpcKeys.SET_CURRENT_APPLICATION, apppath);
  },
};

contextBridge.exposeInMainWorld('api', api);
