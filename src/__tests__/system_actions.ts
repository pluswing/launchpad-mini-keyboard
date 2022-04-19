import { execSync } from 'child_process';
import { launchApp } from 'system_actions';
jest.mock('child_process');

describe(`${__filename}`, () => {
  it('launchApp', () => {
    const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

    launchApp('path to app');

    expect(mockExecSync).toHaveBeenCalled();
    expect(mockExecSync.mock.calls[0][0]).toBe('open "path to app"');
  });
});
