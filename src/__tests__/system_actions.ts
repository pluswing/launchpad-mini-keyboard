import child_process from 'child_process';
import { launchApp } from 'system_actions';
import * as util from '../util';

describe(`${__filename}`, () => {
  it('launchApp (mac)', () => {
    const mock = jest.spyOn(child_process, 'execSync');
    mock.mockClear();
    mock.mockReturnValue('');
    jest.spyOn(util, 'isMac').mockReturnValue(true);

    launchApp('path to app');

    expect(mock).toHaveBeenCalled();
    expect(mock.mock.calls[0][0]).toBe('open "path to app"');
  });

  it('launchApp (win)', () => {
    const mock = jest.spyOn(child_process, 'execSync');
    mock.mockClear();
    mock.mockReturnValue('');
    jest.spyOn(util, 'isMac').mockReturnValue(false);

    launchApp('path to app');

    expect(mock).toHaveBeenCalled();
    expect(mock.mock.calls[0][0]).toBe('"path to app"');
  });
});
