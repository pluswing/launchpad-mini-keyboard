import { exec } from 'child_process';

export const watchForgroundApp = (callback: (appname: string) => void) => {
  let currentApp = '';
  return setInterval(() => {
    exec('lsappinfo info `lsappinfo front`', (error, stdout, stderr) => {
      const m = stdout.match(/bundle path="(.*)"/);
      if (m) {
        if (currentApp != m[1]) {
          callback(m[1]);
        }
        currentApp = m[1];
      }
    });
  }, 2000);
};
