import { execSync } from 'child_process';

export const launchApp = (filePath: string) => {
  execSync(`open "${filePath}"`);
};
