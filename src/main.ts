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
  setLaunchpadListener,
  startBackgroundAnimation,
  stopBackgroundAnimation,
} from './launchpad';
import {
  getActions,
  getBgAnimation,
  getBgColors,
  getTapColors,
  saveAction,
  saveBgAnimation,
  saveBgColor,
  saveTapColor,
  setCurrentApplication,
} from './store';
import { Point, toPoint } from './draw';
import { Action } from './actions';
import { launchApp, mouseToEdge, typeKeystroke } from './system_actions';
import { isMac } from './util';
import { watchForegroundApp } from './foregroundapp';

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
let backgroundProcesses: NodeJS.Timer[] = [];
let settingWindow: BrowserWindow | null = null;

const showPreferences = () => {
  if (settingWindow) {
    settingWindow.hide();
    settingWindow.show();
    return;
  }

  const size = isMac()
    ? { width: 690 + 300, height: 718 }
    : { width: 1003, height: 745 };

  settingWindow = new BrowserWindow({
    ...size,
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
    hideDock();
  });
  showDock();
};

const hideDock = () => {
  isMac() && app.dock.hide();
};

const showDock = () => {
  isMac() && app.dock.show();
};

const bindIpc = (window: BrowserWindow) => {
  let currentPage = 'global';
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
        if (currentPage == 'global') {
          eventLaunchpad(event, note);
        }
      },
    });
  });

  ipcMain.removeHandler(IpcKeys.LOAD_SETTING);
  ipcMain.handle(IpcKeys.LOAD_SETTING, () => {
    const s: Setting = {
      // shortcuts: getShortcuts(),
      actions: getActions(),
      tapColors: getTapColors(),
      bgColors: getBgColors(),
      bgAnimation: getBgAnimation(),
    };
    return s;
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

  ipcMain.removeHandler(IpcKeys.SELECT_FILE);
  ipcMain.handle(IpcKeys.SELECT_FILE, async () => {
    const filters = isMac()
      ? [{ name: 'Application', extensions: ['app'] }]
      : [{ name: 'exe', extensions: ['exe'] }];
    const res = await dialog.showOpenDialog({
      title: 'select application',
      filters,
      properties: ['openFile'],
    });
    return res.filePaths[0];
  });

  ipcMain.removeHandler(IpcKeys.CHANGE_BG_ANIMATION);
  ipcMain.handle(IpcKeys.CHANGE_BG_ANIMATION, async (_, anim) => {
    saveBgAnimation(anim);
    startBackgroundAnimation();
  });

  ipcMain.removeHandler(IpcKeys.CHANGE_PAGE);
  ipcMain.handle(IpcKeys.CHANGE_PAGE, async (_, page) => {
    if (page == 'global') {
      startBackgroundAnimation();
    } else if (page == 'button') {
      stopBackgroundAnimation();
      applyLaunchpad();
    }
    currentPage = page;
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
  hideDock();
};

const setupShortcut = () => {
  setLaunchpadListener({
    connected: () => {
      applyLaunchpad();
      startBackgroundAnimation();
    },
    disconnected: () => {
      stopBackgroundAnimation();
    },
    onNote: (event, note) => {
      eventLaunchpad(event, note);
      if (event == 'down') {
        runShortcut(toPoint(note));
      }
    },
  });
};

const runShortcut = (p: Point) => {
  const actions = getActions();
  const act = actions[p.y][p.x];
  if (act.type == 'shortcut') {
    typeKeystroke(act.shortcuts);
  }
  if (act.type == 'mouse') {
    mouseToEdge(act.edge);
  }
  if (act.type == 'applaunch') {
    launchApp(act.appName);
  }
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
  backgroundProcesses.push(initLaunchpad());
  backgroundProcesses.push(
    watchForegroundApp((apppath: string) => {
      setCurrentApplication(apppath);
      console.log(apppath);
    })
  );
  setupShortcut();
});

app.on('window-all-closed', () => 1);
app.once('before-quit', () => {
  disposeApp();
  app.quit();
});

const disposeApp = () => {
  liveMode();
  backgroundProcesses.map((p) => clearInterval(p));
  backgroundProcesses = [];
  tray?.destroy();
  tray = null;
  settingWindow?.close();
  settingWindow = null;
};
