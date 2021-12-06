declare global {
  interface Window {
    api: Api
  }
}

export enum IpcKeys {
  AAA = "AAA",
  BBB = "BBB"
}

export type Api = {
  sendMessage: (arg: string) => Promise<string>
  onUpdateMessage: (listener: (message: string) => void) => void
}
