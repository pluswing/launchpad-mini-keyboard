import path from 'path';
import { BrowserWindow, app, session, ipcMain } from 'electron';
import { searchDevtools } from 'electron-search-devtools';
import { IpcKeys } from './ipc';

const isDev = process.env.NODE_ENV === 'development';

/// #if DEBUG
const execPath =
  process.platform === 'win32'
    ? '../node_modules/electron/dist/electron.exe'
    : '../node_modules/.bin/electron';

if (isDev) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('electron-reload')(__dirname, {
    electron: path.resolve(__dirname, execPath),
    forceHardReset: true,
    hardResetMethod: 'exit',
  });
}
/// #endif

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 690,
    height: 710,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
  mainWindow.loadFile('dist/index.html');

  ipcMain.handle(IpcKeys.AAA, (event, arg: string) => {
    console.log("RECEIVE AAA", arg)
    return `BBB ${arg}`
  })
  // ipcMain.emit("BBB")
};

app.whenReady().then(async () => {
  if (isDev) {
    const devtools = await searchDevtools('REACT');
    if (devtools) {
      await session.defaultSession.loadExtension(devtools, {
        allowFileAccess: true,
      });
    }
  }

  createWindow();
});

app.once('window-all-closed', () => app.quit());
