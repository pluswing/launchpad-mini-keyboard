import path from 'path';
import {
  BrowserWindow,
  app,
  session,
  ipcMain,
  Tray,
  Menu,
  MenuItem,
} from 'electron';
import { searchDevtools } from 'electron-search-devtools';
import { IpcKeys, Setting } from './ipc';
import {
  applyLaunchpad,
  eventLaunchpad,
  initLaunchpad,
  liveMode,
  setLaunchpadListener,
} from './launchpad';
import {
  getBgColors,
  getShortcuts,
  getTapColors,
  saveBgColor,
  saveShortcut,
  saveTapColor,
} from './preferenecs';
import { toPoint } from './draw';
import { Key, keyboard } from '@nut-tree/nut-js';
import keycode from 'keycode';
import { s2k } from './keys';

const root = __dirname;

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

let tray: Tray | null = null;
let backgroundProcess: NodeJS.Timer | null = null;
let settingWindow: BrowserWindow | null = null;

const showPreferences = () => {
  if (settingWindow) {
    settingWindow.hide();
    settingWindow.show();
    return;
  }

  settingWindow = new BrowserWindow({
    width: 690,
    height: 718,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  bindIpc(settingWindow);

  if (isDev) settingWindow.webContents.openDevTools({ mode: 'detach' });
  settingWindow.loadFile('dist/index.html');

  settingWindow.on('closed', () => {
    settingWindow = null;
    setupShortcut();
    app.dock.hide();
  });
  app.dock.show();
};

const bindIpc = (window: BrowserWindow) => {
  ipcMain.removeHandler(IpcKeys.READY);
  ipcMain.removeHandler(IpcKeys.LOAD_SETTING);
  ipcMain.removeHandler(IpcKeys.CHANGE_SHORTCUT);
  ipcMain.removeHandler(IpcKeys.CHANGE_BG_COLOR);
  ipcMain.removeHandler(IpcKeys.CHANGE_TAP_COLOR);

  ipcMain.handle(IpcKeys.READY, () => {
    setLaunchpadListener({
      connected: () => {
        window.webContents.send(IpcKeys.CONNECTED);
        applyLaunchpad();
      },
      disconnected: () => {
        window.webContents.send(IpcKeys.DISCONNECTED);
      },
      onNote: (event, note) => {
        window.webContents.send(IpcKeys.ON_NOTE, event, note);
      },
    });
  });

  ipcMain.handle(IpcKeys.LOAD_SETTING, () => {
    return {
      shortcuts: getShortcuts(),
      tapColors: getTapColors(),
      bgColors: getBgColors(),
    } as Setting;
  });

  ipcMain.handle(
    IpcKeys.CHANGE_SHORTCUT,
    (_, x: number, y: number, shortcut: string[]) => {
      saveShortcut(x, y, shortcut);
    }
  );

  ipcMain.handle(
    IpcKeys.CHANGE_BG_COLOR,
    (_, x: number, y: number, colorIndex: number) => {
      saveBgColor(x, y, colorIndex);
      applyLaunchpad();
    }
  );

  ipcMain.handle(
    IpcKeys.CHANGE_TAP_COLOR,
    (_, x: number, y: number, colorIndex: number) => {
      saveTapColor(x, y, colorIndex);
      applyLaunchpad();
    }
  );
};

const setupTray = () => {
  tray = new Tray(path.join(root, 'assets', 'icon_bw.png'));
  const menu = new Menu();

  menu.append(
    new MenuItem({
      label: 'Preferences',
      click: () => {
        showPreferences();
      },
    })
  );
  menu.append(new MenuItem({ type: 'separator' }));
  menu.append(new MenuItem({ role: 'quit' }));

  tray.setContextMenu(menu);
  app.dock.hide();
};

const setupShortcut = () => {
  setLaunchpadListener({
    connected: () => {
      applyLaunchpad();
    },
    disconnected: () => 1,
    onNote: (event, note) => {
      eventLaunchpad(event, note);
      if (event == 'down') {
        const ss = getShortcuts();
        const p = toPoint(note);
        const s = ss[p.y][p.x];
        if (s && s.length) {
          const keys = [Key.LeftSuper]; // s.map((v) => s2k(v));
          console.log(s, keys);
          (async () => {
            console.log('press', keys);
            await keyboard.pressKey(...keys);
            console.log('type A');
            await keyboard.type('A');
            console.log('release', keys);
            await keyboard.releaseKey(...keys);
          })();
        }
      }
    },
  });
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

  setupTray();
  backgroundProcess = initLaunchpad();
  setupShortcut();
});

app.on('window-all-closed', () => 1);
app.once('before-quit', () => {
  disposeApp();
  app.quit();
});

const disposeApp = () => {
  liveMode();
  if (backgroundProcess) {
    clearInterval(backgroundProcess);
  }
  backgroundProcess = null;
  tray?.destroy();
  tray = null;
  settingWindow?.close();
  settingWindow = null;
};
