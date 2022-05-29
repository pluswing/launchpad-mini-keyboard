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
  }, 2000);
};
