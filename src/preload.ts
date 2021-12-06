import { contextBridge, ipcRenderer } from 'electron'
import { IpcRendererEvent } from 'electron/main'
import { Api, IpcKeys } from './ipc'

const api: Api = {
  sendMessage: async (arg: string): Promise<string> =>
    await ipcRenderer.invoke(IpcKeys.AAA, arg),

  onUpdateMessage: (listener: (message: string) => void) =>
    ipcRenderer.on(
      IpcKeys.BBB,
      (ev: IpcRendererEvent, message: string) => listener(message)
    )
}

contextBridge.exposeInMainWorld('api', api)
