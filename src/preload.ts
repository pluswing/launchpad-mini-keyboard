import { contextBridge, ipcRenderer } from 'electron';
import { Action } from './actions';
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
  enterSelectingColor: async () => {
    return await ipcRenderer.invoke(IpcKeys.ENTER_SELECTING_COLOR);
  },
  leaveSelectingColor: async () => {
    return await ipcRenderer.invoke(IpcKeys.LEAVE_SELECTING_COLOR);
  },
  changeSelectingColorPage: async (page: number) => {
    return await ipcRenderer.invoke(IpcKeys.CHANGE_SELECTING_COLOR_PAGE, page);
  },
  selectFile: async () => {
    return await ipcRenderer.invoke(IpcKeys.SELECT_FILE);
  },
};

contextBridge.exposeInMainWorld('api', api);
