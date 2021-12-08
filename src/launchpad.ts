import { ipcMain } from "electron";
import {Input, Output} from "midi"
import { IpcKeys } from "./ipc";
import { range } from "./util";

const input = new Input();
const output = new Output();

export const initLaunchpad = () => {
  let connected = false

  setInterval(() => {
    console.log("watch connect")
    // 接続監視処理
    const inputIndex = searchMidi(input, "LPMiniMK3 MIDI")
    const outputIndex = searchMidi(output, "LPMiniMK3 MIDI")

    console.log(inputIndex, outputIndex)
    if (inputIndex == -1 || outputIndex == -1) {
      if (connected) {
        // 接続が切れた
        disconnect()
      }
      connected = false
      // 接続されてない
      console.log("not connected")
      return
    }

    if (connected) {
      return
    }

    console.log("connected")
    input.openPort(inputIndex)
    output.openPort(outputIndex)
    connected = true

    // 初期化処理
    init();
  }, 1000)
}

const searchMidi = (io: Input|Output, search: string): number => {
  const names = range(io.getPortCount()).map((i) => io.getPortName(i))
  return names.findIndex((name) => name.indexOf(search))
}

const init = () => {
  // 設定ファイル読み込み
  // launchpadの初期化
  // ノートが押された時の対応(robotjs)
  // BGのアニメーション
  ipcMain.emit(IpcKeys.CONNECTED)
}

const disconnect = () => {
  ipcMain.emit(IpcKeys.DISCONNECTED)
  input.closePort()
  output.closePort()
}
