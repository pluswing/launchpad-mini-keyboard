import path from 'path';
import {
  BrowserWindow,
  app,
  session,
  ipcMain,
  Tray,
  Menu,
  MenuItem,
  dialog,
} from 'electron';
import { searchDevtools } from 'electron-search-devtools';
import { IpcKeys, Setting } from './ipc';
import {
  applyLaunchpad,
  eventLaunchpad,
  initLaunchpad,
  liveMode,
  selectingColor,
  setLaunchpadListener,
} from './launchpad';
import {
  getActions,
  getBgColors,
  getTapColors,
  saveAction,
  saveBgColor,
  saveTapColor,
} from './store';
import { toPoint } from './draw';
import { extractKeys } from './keyboard';
import { Action } from './actions';
import { launchApp, mouseToEdge, typeKeyboard } from './system_actions';

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
    width: 690 + 300,
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

  ipcMain.removeHandler(IpcKeys.LOAD_SETTING);
  ipcMain.handle(IpcKeys.LOAD_SETTING, () => {
    return {
      // shortcuts: getShortcuts(),
      actions: getActions(),
      tapColors: getTapColors(),
      bgColors: getBgColors(),
    } as Setting;
  });

  ipcMain.removeHandler(IpcKeys.CHANGE_ACTION);
  ipcMain.handle(
    IpcKeys.CHANGE_ACTION,
    (_, x: number, y: number, action: Action) => {
      saveAction(x, y, action);
    }
  );

  ipcMain.removeHandler(IpcKeys.CHANGE_BG_COLOR);
  ipcMain.handle(
    IpcKeys.CHANGE_BG_COLOR,
    (_, x: number, y: number, colorIndex: number) => {
      saveBgColor(x, y, colorIndex);
      applyLaunchpad();
    }
  );

  ipcMain.removeHandler(IpcKeys.CHANGE_TAP_COLOR);
  ipcMain.handle(
    IpcKeys.CHANGE_TAP_COLOR,
    (_, x: number, y: number, colorIndex: number) => {
      saveTapColor(x, y, colorIndex);
      applyLaunchpad();
    }
  );

  ipcMain.removeHandler(IpcKeys.ENTER_SELECTING_COLOR);
  ipcMain.handle(IpcKeys.ENTER_SELECTING_COLOR, () => {
    selectingColor(0);
  });

  ipcMain.removeHandler(IpcKeys.LEAVE_SELECTING_COLOR);
  ipcMain.handle(IpcKeys.LEAVE_SELECTING_COLOR, () => {
    applyLaunchpad();
  });

  ipcMain.removeHandler(IpcKeys.CHANGE_SELECTING_COLOR_PAGE);
  ipcMain.handle(IpcKeys.CHANGE_SELECTING_COLOR_PAGE, (_, page: number) => {
    selectingColor(page);
  });

  ipcMain.removeHandler(IpcKeys.SELECT_FILE);
  ipcMain.handle(IpcKeys.SELECT_FILE, async () => {
    // FIXME windows
    const res = await dialog.showOpenDialog({
      title: 'select .app file',
      filters: [{ name: 'Application', extensions: ['app'] }],
      properties: ['openFile'],
    });
    return res.filePaths[0];
  });
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
        const actions = getActions();
        const p = toPoint(note);
        const act = actions[p.y][p.x];
        if (act.type == 'shortcut') {
          act.shortcuts.forEach((s) => {
            const sc = extractKeys(s);
            if (sc) {
              typeKeyboard(sc);
            }
            // MEMO delay ...
          });
        }
        if (act.type == 'mouse') {
          mouseToEdge(act.edge);
        }
        if (act.type == 'applaunch') {
          launchApp(act.appName);
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
