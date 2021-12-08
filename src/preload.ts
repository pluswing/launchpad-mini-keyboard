import { contextBridge, ipcRenderer } from 'electron'
import { IpcRendererEvent } from 'electron/main'
import { Api, IpcKeys, LaunchpadListener } from './ipc'

const api: Api = {
  sendMessage: async (arg: string): Promise<string> => {
    return await ipcRenderer.invoke(IpcKeys.AAA, arg)
  },
  onUpdateMessage: (listener: LaunchpadListener) => {
    ipcRenderer.on(IpcKeys.CONNECTED, (ev: IpcRendererEvent, message: string) => {
      listener.connected()
    })
    ipcRenderer.on(IpcKeys.DISCONNECTED, (ev: IpcRendererEvent, message: string) => {
      listener.disconnected()
    })
  }
}

contextBridge.exposeInMainWorld('api', api)
