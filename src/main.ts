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
import { IpcKeys, RegisterApplication, Setting } from './ipc';
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
  addRegisterApplications,
  getActions,
  getBgAnimation,
  getBgColors,
  getRegisterApplications,
  getTapColors,
  removeRegisterApplications,
  saveAction,
  saveBgAnimation,
  saveBgColor,
  saveTapColor,
  setCurrentApplication,
} from './store';
import { Point, toPoint } from './draw';
import { Action } from './actions';
import { launchApp, mouseToEdge, typeKeystroke } from './system_actions';
import { isMac, isWindows } from './util';
import { watchForegroundApp } from './foregroundapp';

import { execSync } from 'child_process';
import bplist from 'bplist-parser';
import plist from 'plist';
import fs from 'fs';
import tempy from 'tempy';
import { autoUpdater } from 'electron-updater';

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

  // 設定を開いた時はデフォルトを必ず開く。
  setCurrentApplication('');
  startBackgroundAnimation();
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
  ipcMain.handle(IpcKeys.LOAD_SETTING, async () => {
    const s: Setting = {
      // shortcuts: getShortcuts(),
      actions: getActions(),
      tapColors: getTapColors(),
      bgColors: getBgColors(),
      bgAnimation: getBgAnimation(),
      registerApplications: await getRegisterApplicationsWithIcon(),
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

  ipcMain.removeHandler(IpcKeys.ADD_APPLICATION);
  ipcMain.handle(IpcKeys.ADD_APPLICATION, async (_, apppath) => {
    addRegisterApplications(apppath);
  });

  ipcMain.removeHandler(IpcKeys.REMOVE_APPLICATION);
  ipcMain.handle(IpcKeys.REMOVE_APPLICATION, async (_, apppath) => {
    removeRegisterApplications(apppath);
  });

  ipcMain.removeHandler(IpcKeys.SET_CURRENT_APPLICATION);
  ipcMain.handle(IpcKeys.SET_CURRENT_APPLICATION, async (_, apppath) => {
    setCurrentApplication(apppath);
    startBackgroundAnimation();
    const s: Setting = {
      actions: getActions(),
      tapColors: getTapColors(),
      bgColors: getBgColors(),
      bgAnimation: getBgAnimation(),
      registerApplications: await getRegisterApplicationsWithIcon(),
    };
    return s;
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
      if (settingWindow) {
        return;
      }
      setCurrentApplication(apppath);
      startBackgroundAnimation();
      console.log(apppath);
    })
  );
  setupShortcut();

  autoUpdater.checkForUpdatesAndNotify();

  // for test
  if (process.argv.find((v) => v === '--autoopen')) {
    showPreferences();
  }
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

const getRegisterApplicationsWithIcon = (): Promise<RegisterApplication[]> => {
  const apppaths = getRegisterApplications();
  return Promise.all(
    apppaths.map(async (apppath) => ({
      apppath,
      icon: await getAppIcon(apppath),
    }))
  );
};

const loadPlist = async (plistFile: string): Promise<any> => {
  try {
    const [parsed] = await bplist.parseFile(plistFile);
    return parsed;
  } catch (e) {
    return plist.parse(fs.readFileSync(plistFile, 'utf8'));
  }
};

const getAppIcon = async (apppath: string): Promise<string> => {
  // v0.3.0リリースのため、一時的に無効化
  if (isMac() || isWindows()) return '';
  const plistFile = path.join(apppath, 'Contents', 'Info.plist');
  const parsed = await loadPlist(plistFile);
  const icon = parsed['CFBundleIconFile'].replace('.icns', '');
  if (!icon) {
    return '';
  }

  const icnsFile = path.join(apppath, 'Contents', 'Resources', `${icon}.icns`);

  const output = path.join(tempy.directory(), `${icon}.iconset`);

  execSync(`iconutil --convert iconset "${icnsFile}" --output "${output}"`);

  const pngs = fs
    .readdirSync(output)
    .map((f) => path.join(output, f))
    .map((png) => ({ file: png, size: fs.statSync(png).size }))
    .sort((a, b) => b.size - a.size);
  const img = fs.readFileSync(pngs[0].file, 'base64');
  return `data:image/png;base64,${img}`;
};
