import activeWindow from 'active-win';

export const watchForegroundApp = (callback: (apppath: string) => void) => {
  let currentApp = '';
  return setInterval(async () => {
    const act = await activeWindow();
    if (!act) {
      return;
    }
    const path = act.owner.path;
    if (currentApp != path) {
      callback(path);
    }
    currentApp = path;

    // exec('lsappinfo info `lsappinfo front`', (error, stdout, stderr) => {
    //   const m = stdout.match(/bundle path="(.*)"/);
    //   if (m) {
    //     if (currentApp != m[1]) {
    //       callback(m[1]);
    //     }
    //     currentApp = m[1];
    //   }
    // });
  }, 2000);
};
