"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const electron_search_devtools_1 = require("electron-search-devtools");
const isDev = process.env.NODE_ENV === 'development';
/// #if DEBUG
const execPath = process.platform === 'win32'
    ? '../node_modules/electron/dist/electron.exe'
    : '../node_modules/.bin/electron';
if (isDev) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('electron-reload')(__dirname, {
        electron: path_1.default.resolve(__dirname, execPath),
        forceHardReset: true,
        hardResetMethod: 'exit',
    });
}
/// #endif
const createWindow = () => {
    const mainWindow = new electron_1.BrowserWindow();
    if (isDev)
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.loadFile('dist/index.html');
};
electron_1.app.whenReady().then(async () => {
    if (isDev) {
        const devtools = await (0, electron_search_devtools_1.searchDevtools)('REACT');
        if (devtools) {
            await electron_1.session.defaultSession.loadExtension(devtools, {
                allowFileAccess: true,
            });
        }
    }
    createWindow();
});
electron_1.app.once('window-all-closed', () => electron_1.app.quit());
//# sourceMappingURL=main.js.map