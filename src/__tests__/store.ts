import { Action, Edge } from 'actions';
import { BackgroundAnimation, Direction } from 'backgrounds';
import Store from 'electron-store';
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
} from 'store';

describe(`${__filename}`, () => {
  beforeEach(() => {
    new Store().clear();
  });

  it('bgColor', () => {
    const res = getBgColors();
    expect(res.length).toBe(9);
    expect(res[0].length).toBe(9);
    expect(res[0][0]).toBe(0);

    saveBgColor(0, 0, 1);
    expect(getBgColors()[0][0]).toBe(1);
  });

  it('tapColor', () => {
    const res = getTapColors();
    expect(res.length).toBe(9);
    expect(res[0].length).toBe(9);
    expect(res[0][0]).toBe(0);

    saveTapColor(0, 0, 1);
    expect(getTapColors()[0][0]).toBe(1);
  });

  it('bgAnimation', () => {
    expect(getBgAnimation()).toEqual({ type: 'none' });

    const anim: BackgroundAnimation = {
      type: 'rainbow',
      interval: 20,
      saturation: 1,
      value: 1,
      direction: Direction.LEFT,
    };
    saveBgAnimation(anim);
    expect(getBgAnimation()).toEqual(anim);
  });

  it('actions', () => {
    const res = getActions();
    expect(res.length).toBe(9);
    expect(res[0].length).toBe(9);
    expect(res[0][0]).toEqual({
      type: 'shortcut',
      shortcuts: [[]],
    });

    const act: Action = {
      type: 'mouse',
      edge: Edge.BOTTOM_LEFT,
    };
    saveAction(0, 0, act);
    expect(getActions()[0][0]).toEqual(act);
  });

  it('registerApplications', () => {
    expect(getRegisterApplications()).toEqual([]);
    addRegisterApplications('AAA');
    expect(getRegisterApplications()).toEqual(['AAA']);
    addRegisterApplications('BBB');
    expect(getRegisterApplications()).toEqual(['AAA', 'BBB']);
    addRegisterApplications('AAA');
    expect(getRegisterApplications()).toEqual(['AAA', 'BBB']);
    removeRegisterApplications('CCC');
    expect(getRegisterApplications()).toEqual(['AAA', 'BBB']);
    removeRegisterApplications('AAA');
    expect(getRegisterApplications()).toEqual(['BBB']);
  });

  it('currentApplication', () => {
    addRegisterApplications('AAA');
    addRegisterApplications('BBB');
    expect(getRegisterApplications()).toEqual(['AAA', 'BBB']);

    setCurrentApplication('');
    expect(getBgColors()[0][0]).toBe(0);
    saveBgColor(0, 0, 1);
    expect(getBgColors()[0][0]).toBe(1);

    setCurrentApplication('AAA');
    expect(getBgColors()[0][0]).toBe(0);
    saveBgColor(0, 0, 2);
    expect(getBgColors()[0][0]).toBe(2);

    setCurrentApplication('BBB');
    expect(getBgColors()[0][0]).toBe(0);
    saveBgColor(0, 0, 3);
    expect(getBgColors()[0][0]).toBe(3);

    setCurrentApplication('');
    expect(getBgColors()[0][0]).toBe(1);

    setCurrentApplication('AAA');
    expect(getBgColors()[0][0]).toBe(2);

    setCurrentApplication('BBB');
    expect(getBgColors()[0][0]).toBe(3);
  });
});
