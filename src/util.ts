export const range = (n: number) => [...new Array(n).keys()];

export const isWindows = () => process.platform === 'win32';
export const isMac = () => process.platform === 'darwin';
