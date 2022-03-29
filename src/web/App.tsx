import keycode from 'keycode';
import { useCallback, useEffect, useState } from 'react';
import { toPoint } from '../draw';
import {
  Action,
  AppLaunch,
  defaultAction,
  Edge,
  Mouse,
  Shortcut,
} from '../actions';
import { range } from '../util';
import { BlackButton } from './components/BlackButton';
import { Button as WhiteButton } from './components/Button';
import { Select } from './components/Select';
import {
  BackgroundAnimation,
  BreathAnimation,
  defaultAnimationData,
  Direction,
  noneAnimation,
  NoneAnimation,
  RainbowAnimation,
  StaticColorAnimation,
  WaterdropAnimation,
} from '../backgrounds';
import { App as AppData } from '../ipc';

const api = window.api;

interface Black {
  type: 'black';
  content: JSX.Element;
}

interface Icon {
  type: 'icon';
  f: (connected: boolean) => JSX.Element;
}

interface White {
  type: 'white';
}
type Button = Black | Icon | White;

const UP: Button = {
  type: 'black',
  content: (
    <svg
      className="h-8 w-8 text-white"
      style={{ transform: 'rotate(270deg)' }}
      viewBox="0 0 24 24"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="8 6 17 12 8 18 8 6" />
    </svg>
  ),
};

const DOWN: Button = {
  type: 'black',
  content: (
    <svg
      className="h-8 w-8 text-white"
      style={{ transform: 'rotate(90deg)' }}
      viewBox="0 0 24 24"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="8 6 17 12 8 18 8 6" />
    </svg>
  ),
};

const LEFT: Button = {
  type: 'black',
  content: (
    <svg
      className="h-8 w-8 text-white"
      style={{ transform: 'rotate(180deg)' }}
      viewBox="0 0 24 24"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="8 6 17 12 8 18 8 6" />
    </svg>
  ),
};

const RIGHT: Button = {
  type: 'black',
  content: (
    <svg
      className="h-8 w-8 text-white"
      style={{ transform: 'rotate(0deg)' }}
      viewBox="0 0 24 24"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="8 6 17 12 8 18 8 6" />
    </svg>
  ),
};

const SESSION: Button = {
  type: 'black',
  content: <span className="text-white text-xs">Session</span>,
};

const DRUMS: Button = {
  type: 'black',
  content: <span className="text-white text-xs">Drums</span>,
};

const KEYS: Button = {
  type: 'black',
  content: <span className="text-white text-xs">Keys</span>,
};

const USER: Button = {
  type: 'black',
  content: <span className="text-white text-xs">User</span>,
};

const ICON: Button = {
  type: 'icon',
  f: (connected: boolean) => (
    <svg
      className={`h-12 w-12 ${connected ? 'text-red-500' : 'text-gray-500'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
};

const DISCLOSURE: Button = {
  type: 'black',
  content: (
    <svg
      className="h-6 w-6 text-white"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <polyline points="9 6 15 12 9 18" />
    </svg>
  ),
};

const STOP_SOLO_MUTE: Button = {
  type: 'black',
  content: (
    <span className="text-white text-xs">
      Stop
      <br />
      Solo
      <br />
      Mute
    </span>
  ),
};

const WHITE: Button = {
  type: 'white',
};

const BUTTONS: Button[][] = [
  [UP, DOWN, LEFT, RIGHT, SESSION, DRUMS, KEYS, USER, ICON],
  [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, DISCLOSURE],
  [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, DISCLOSURE],
  [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, DISCLOSURE],
  [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, DISCLOSURE],
  [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, DISCLOSURE],
  [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, DISCLOSURE],
  [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, DISCLOSURE],
  [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, STOP_SOLO_MUTE],
];

const colorGrid = (): number[][] => range(9).map(() => range(9).map(() => 0));

const actionGrid = (): Action[][] =>
  range(9).map(() => range(9).map(() => defaultAction()));

export const App = (): JSX.Element => {
  const [connected, setConnected] = useState(false);
  const [onDown, setOnDown] = useState(false);

  api.onUpdateMessage({
    connected: async () => {
      setConnected(true);
    },
    disconnected: () => {
      setConnected(false);
    },
    onNote: (event, note) => {
      const p = toPoint(note);
      if (event == 'up') {
        setOnDown(false);
        if (tab == Tab.BUTTON) {
          showButtonSetting(p.x, p.y);
        }
      } else if (event == 'down') {
        setOnDown(true);
      }
    },
  });

  // on mounted
  useEffect(() => {
    api.ready();
    loadSetting();
  }, []);

  const loadSetting = () => {
    api.loadSetting().then((data) => {
      setActions(data.actions);
      setBgColors(data.bgColors);
      setTapColors(data.tapColors);
      setBgAnimation(data.bgAnimation);
      setAppList(data.registerApplications);
    });
  };

  // data
  const [actions, setActions] = useState(actionGrid());
  const [bgColors, setBgColors] = useState(colorGrid());
  const [tapColors, setTapColors] = useState(colorGrid());
  const [bgAnimation, setBgAnimation] = useState(noneAnimation());

  // sidebar
  enum Tab {
    GLOBAL,
    BUTTON,
  }
  const [tab, setTab] = useState(Tab.GLOBAL);
  const [current, setCurrent] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const showButtonSetting = (x: number, y: number) => {
    setCurrent({ x, y });
    setAction(actions[y][x]);
    setBgColor(bgColors[y][x]);
    setTapColor(tapColors[y][x]);
    setTabPage(Tab.BUTTON);
  };

  const [action, setAction] = useState<Action>(defaultAction());
  const [bgColor, setBgColor] = useState(0);
  const [tapColor, setTapColor] = useState(0);

  const setActionType = (e: any) => {
    const type = e.target.value;
    const act = actions[current.y][current.x];
    if (act.type === type) {
      return;
    }

    let newAct = defaultAction();
    if (type == 'mouse') {
      newAct = { type: 'mouse', edge: Edge.TOP_LEFT } as Mouse;
    }
    if (type == 'applaunch') {
      newAct = { type: 'applaunch', appName: '' } as AppLaunch;
    }
    setAction({ ...newAct });
    actions[current.y][current.x] = newAct;
    setActions([...actions]);
    api.changeAction(current.x, current.y, newAct);
  };

  const isMac = () => {
    const ua = window.navigator.userAgent.toUpperCase();
    return ua.indexOf('MAC OS') !== -1;
  };

  const onKeyDown = (e: any, i: number) => {
    e.preventDefault();
    const onSpecialKey = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
    const specialKeys = [
      'ctrl',
      'shift',
      'alt',
      'left command',
      'right command',
      'shift',
    ];
    if (onSpecialKey && specialKeys.includes(keycode(e))) {
      // special keyの単押しなので無視。
      return;
    }

    if (!keycode(e)) {
      // なぜか一部nullが返ることがあるので一旦無視。
      return;
    }

    const s = [
      e.ctrlKey ? (isMac() ? '⌃' : 'ctrl') : '',
      e.altKey ? (isMac() ? '⌥' : 'alt') : '',
      e.shiftKey ? (isMac() ? '⇧' : 'shift') : '',
      e.metaKey ? (isMac() ? '⌘' : 'super') : '',
      keycode(e).toUpperCase(),
    ].filter((v) => v);

    // TODO shortcut以外のアクションの場合の対応
    const act = actions[current.y][current.x] as Shortcut;
    act.shortcuts[i] = s;

    setAction({ ...act });
    setActions([...actions]);
    api.changeAction(current.x, current.y, act);
  };

  const addShortcut = () => {
    const act = actions[current.y][current.x] as Shortcut;
    act.shortcuts.push([]);
    setAction({ ...act });
    setActions([...actions]);
  };

  const removeShortcut = (index: number) => {
    const act = actions[current.y][current.x] as Shortcut;
    act.shortcuts = act.shortcuts.filter((s, i) => i !== index);
    setAction({ ...act });
    setActions([...actions]);
    api.changeAction(current.x, current.y, act);
  };

  const setMouseEdge = (e: any) => {
    const edge = parseInt(e.target.value, 10);
    updateAction((act: Action) => {
      (act as Mouse).edge = edge;
      return act;
    });
  };

  const updateAction = (update: (action: Action) => Action) => {
    const act = actions[current.y][current.x];
    const newAct = update(act);
    actions[current.y][current.x] = newAct;
    setAction({ ...newAct });
    setActions([...actions]);
    api.changeAction(current.x, current.y, newAct);
  };

  const changeBgColor = useCallback(
    (v) => {
      setBgColor(v);
      bgColors[current.y][current.x] = v;
      setBgColors([...bgColors]);
      api.changeBgColor(current.x, current.y, v);
    },
    [setBgColor, setBgColors, current, bgColors]
  );

  const changeTapColor = useCallback(
    (v) => {
      setTapColor(v);
      tapColors[current.y][current.x] = v;
      setTapColors([...tapColors]);
      api.changeTapColor(current.x, current.y, v);
    },
    [setTapColor, setTapColors, current, tapColors]
  );

  const colors = onDown ? tapColors : bgColors;

  const main = (
    <div className="bg-gray-800 p-5">
      <div
        className="grid grid-cols-9 gap-1"
        style={{ width: '650px', height: '650px' }}
      >
        {BUTTONS.map((line, y) => {
          return line.map((b, x) => {
            if (b.type == 'black') {
              return (
                <BlackButton
                  onClick={() => showButtonSetting(x, y)}
                  color={colors[y][x]}
                >
                  {b.content}
                </BlackButton>
              );
            } else if (b.type == 'icon') {
              return (
                <BlackButton
                  onClick={() => showButtonSetting(x, y)}
                  color={colors[y][x]}
                >
                  {b.f(connected)}
                </BlackButton>
              );
            } else if (b.type == 'white') {
              return (
                <WhiteButton
                  onClick={() => showButtonSetting(x, y)}
                  color={colors[y][x]}
                />
              );
            }
          });
        })}
      </div>
    </div>
  );

  const highlightTab = (b: boolean) =>
    b ? 'bg-gray-200 border-blue-400' : 'bg-gray-400 border-gray-500';

  const setTabPage = (tab: Tab) => {
    setTab(tab);
    api.changePage(tab == Tab.GLOBAL ? 'global' : 'button');
  };

  const tabHeader = (
    <div className="flex flex-wrap text-center">
      <div
        onClick={() => setTabPage(Tab.GLOBAL)}
        className={`w-1/2 border-b-2 py-2 ${highlightTab(tab == Tab.GLOBAL)}`}
      >
        GLOBAL
      </div>
      <div
        onClick={() => setTabPage(Tab.BUTTON)}
        className={`w-1/2 border-b-2 py-2 ${highlightTab(tab == Tab.BUTTON)}`}
      >
        BUTTON
      </div>
    </div>
  );

  const shortcutEditor = (action: Shortcut) => {
    return (
      <>
        {action.shortcuts.map((s, i) => (
          <div key={i} className="flex flex-wrap">
            <input
              type="text"
              value={s.join(isMac() ? '' : ' + ')}
              onKeyDown={(e) => onKeyDown(e, i)}
              placeholder="shortcut key"
              className="p-2 rounded m-2 flex-grow"
            />
            <button className="m-2" onClick={() => removeShortcut(i)}>
              <svg
                className="h-8 w-8 text-white"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
        <div className="flex flex-wrap justify-end">
          <button className="m-2" onClick={addShortcut}>
            <svg
              className="h-8 w-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
        </div>
      </>
    );
  };

  const mouseEditor = (action: Mouse) => {
    return (
      <div className="flex flex-wrap m-2">
        <select
          className="w-full p-3"
          value={action.edge}
          onChange={setMouseEdge}
        >
          <option value={Edge.TOP_LEFT}>左上</option>
          <option value={Edge.TOP_RIGHT}>右上</option>
          <option value={Edge.BOTTOM_LEFT}>左下</option>
          <option value={Edge.BOTTOM_RIGHT}>右下</option>
        </select>
      </div>
    );
  };

  const selectAppLaunchFile = async () => {
    const res = await api.selectFile();
    updateAction((act) => {
      (act as AppLaunch).appName = res;
      return act;
    });
  };

  const appLaunchEditor = (action: AppLaunch) => {
    return (
      <div className="flex flex-wrap m-2">
        <div className="flex-grow text-gray-100 h-8 w-8 py-3 overflow-x-scroll">
          {action.appName || '[選択してください]'}
        </div>
        <button onClick={selectAppLaunchFile} className="p-3">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    );
  };

  const actionEditor = (action: Action) => {
    if (action.type == 'shortcut') {
      return shortcutEditor(action);
    }
    if (action.type == 'mouse') {
      return mouseEditor(action);
    }
    if (action.type == 'applaunch') {
      return appLaunchEditor(action);
    }
  };

  const tabButton = (
    <>
      <div className="flex flex-wrap m-2">
        <select
          className="w-full p-3"
          value={action.type}
          onChange={setActionType}
        >
          <option value="shortcut">キーボードショートカット</option>
          <option value="mouse">マウス操作</option>
          <option value="applaunch">アプリケーション起動</option>
        </select>
      </div>
      {actionEditor(action)}
      <Select prefix="tap color" value={tapColor} onChange={changeTapColor} />
      <Select prefix="bg color" value={bgColor} onChange={changeBgColor} />
    </>
  );

  const backgroundEditor = (bgAnim: BackgroundAnimation) => {
    if (bgAnim.type == 'none') {
      return noneEditor(bgAnim);
    }
    if (bgAnim.type == 'rainbow') {
      return rainbowEditor(bgAnim);
    }
    if (bgAnim.type == 'static_color') {
      return staticColorEditor(bgAnim);
    }
    if (bgAnim.type == 'breath') {
      return breathEditor(bgAnim);
    }
    if (bgAnim.type == 'waterdrop') {
      return waterdropEditor(bgAnim);
    }
    return;
  };

  type Field = [string, number, number, number, (e: any) => void];

  const slider = (
    name: string,
    value: number,
    min: number,
    max: number,
    onChange: (e: any) => void
  ) => {
    return (
      <div className="flex flex-wrap w-full pt-3 pb-3">
        <label className="pr-3 text-gray-200 w-24">{name}</label>
        <input
          className="flex-grow"
          type="range"
          value={value}
          min={min}
          max={max}
          step="1"
          onInput={onChange}
        />
      </div>
    );
  };

  const staticColorEditor = (anim: StaticColorAnimation) => {
    const fields: Field[] = [
      ['HUE', anim.hue, 0, 359, changeAnimParam(anim, 'hue')],
      [
        'SATURATION',
        anim.saturation * 100,
        1,
        100,
        changeAnimParam(anim, 'saturation', 100),
      ],
      ['VALUE', anim.value * 100, 1, 100, changeAnimParam(anim, 'value', 100)],
    ];
    return (
      <div className="flex flex-wrap m-2">
        {fields.map((f) => slider(...f))}
      </div>
    );
  };

  const breathEditor = (anim: BreathAnimation) => {
    const fields: Field[] = [
      ['SPEED', anim.speed, 1, 10, changeAnimParam(anim, 'speed')],
      ['HUE', anim.hue, 0, 359, changeAnimParam(anim, 'hue')],
      [
        'SATURATION',
        anim.saturation * 100,
        1,
        100,
        changeAnimParam(anim, 'saturation', 100),
      ],
      [
        'MIN_VALUE',
        anim.min_value * 100,
        1,
        100,
        changeAnimParam(anim, 'min_value', 100),
      ],
      [
        'MAX_VALUE',
        anim.max_value * 100,
        1,
        100,
        changeAnimParam(anim, 'max_value', 100),
      ], // TODO min < maxに必ずなるように制御
    ];
    return (
      <div className="flex flex-wrap m-2">
        {fields.map((f) => slider(...f))}
        <div className="flex flex-wrap w-full pt-3 pb-3">
          <label className="pr-3 text-gray-200 w-24" htmlFor="breath_random">
            RANDOM
          </label>
          <input
            className="m-2"
            id="breath_random"
            type="checkbox"
            checked={anim.random}
            onChange={(e) => {
              const v = e.target.checked;
              const newAnim = { ...anim, random: v };
              setBgAnimation(newAnim);
              api.changeBgAnimation(newAnim);
            }}
          />
        </div>
      </div>
    );
  };

  const waterdropEditor = (anim: WaterdropAnimation) => {
    const fields: Field[] = [
      ['TIME', anim.time, 1, 20, changeAnimParam(anim, 'time')],
      ['SIZE', anim.size, 1, 4, changeAnimParam(anim, 'size')],
      ['HUE', anim.hue, 0, 359, changeAnimParam(anim, 'hue')],
      [
        'SATURATION',
        anim.saturation * 100,
        1,
        100,
        changeAnimParam(anim, 'saturation', 100),
      ],
      ['VALUE', anim.value * 100, 1, 100, changeAnimParam(anim, 'value', 100)],
    ];
    return (
      <div className="flex flex-wrap m-2">
        {fields.map((f) => slider(...f))}
        <div className="flex flex-wrap w-full pt-3 pb-3">
          <label className="pr-3 text-gray-200 w-24" htmlFor="breath_random">
            RANDOM
          </label>
          <input
            className="m-2"
            id="breath_random"
            type="checkbox"
            checked={anim.random}
            onChange={(e) => {
              const v = e.target.checked;
              const newAnim = { ...anim, random: v };
              setBgAnimation(newAnim);
              api.changeBgAnimation(newAnim);
            }}
          />
        </div>
      </div>
    );
  };

  const noneEditor = (_: NoneAnimation) => {
    return <div className="flex flex-wrap m-2"></div>;
  };

  const changeAnimParam = (anim: BackgroundAnimation, key: string, div = 1) => {
    return (e: any) => {
      const newValue = parseInt(e.target.value, 10) / div;
      const newAnim = { ...anim, [key]: newValue };
      setBgAnimation(newAnim);
      api.changeBgAnimation(newAnim);
    };
  };

  const rainbowEditor = (anim: RainbowAnimation) => {
    const fields: Field[] = [
      ['INTERVAL', anim.interval, 1, 60, changeAnimParam(anim, 'interval')],
      [
        'SATURATION',
        anim.saturation * 100,
        1,
        100,
        changeAnimParam(anim, 'saturation', 100),
      ],
      ['VALUE', anim.value * 100, 1, 100, changeAnimParam(anim, 'value', 100)],
    ];

    return (
      <div className="flex flex-wrap m-2">
        {fields.map((f) => slider(...f))}
        <select
          className="w-full p-3"
          value={anim.direction}
          onChange={changeAnimParam(anim, 'direction')}
        >
          <option value={Direction.LEFT}>右から左</option>
          <option value={Direction.RIGHT}>左から右</option>
          <option value={Direction.UP}>下から上</option>
          <option value={Direction.DOWN}>上から下</option>
        </select>
      </div>
    );
  };

  const changeBgAnimationType = (e: any) => {
    const type = e.target.value;
    const newBgAnim = defaultAnimationData(type);
    setBgAnimation(newBgAnim);
    api.changeBgAnimation(newBgAnim);
  };

  const [appList, setAppList] = useState([] as AppData[]);
  const [currentApp, setCurrentApp] = useState('');

  const changeApp = async (e: any) => {
    await _changeApp(e.target.value);
  };

  const _changeApp = async (apppath: string) => {
    setCurrentApp(apppath);
    await api.setCurrentApplication(apppath);
    loadSetting();
  };

  const addApp = async () => {
    const path = await api.selectFile();
    if (!path) return;
    // setAppList([...appList, path]);
    await api.addApplication(path);
    await loadSetting();
  };

  const removeApp = async () => {
    const list = [...appList.filter((a) => a.path !== currentApp)];
    setAppList(list);
    api.removeApplication(currentApp);
    _changeApp(''); // FIXME
  };

  const appSelector = () => {
    return (
      <>
        <div className="w-full border-t-2 border-gray-200"></div>
        <div className="flex flex-wrap m-2">
          <select
            className="w-full p-3"
            value={currentApp}
            onChange={changeApp}
          >
            <option value="">DEFAULT</option>
            {appList.map((a) => (
              <option key={a.path} value={a.path}>
                {a.path}
              </option>
            ))}
          </select>
          <button className="m-2" onClick={() => removeApp()}>
            <svg
              className="h-8 w-8 text-white"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="flex flex-wrap justify-end">
            <button className="m-2" onClick={addApp}>
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </>
    );
  };

  const tabGlobal = (
    <>
      <div className="flex flex-wrap m-2">
        <select
          className="w-full p-3"
          value={bgAnimation.type}
          onChange={changeBgAnimationType}
        >
          <option value="none">なし</option>
          <option value="rainbow">虹色</option>
          <option value="static_color">静的</option>
          <option value="breath">呼吸</option>
          <option value="waterdrop">水滴</option>
        </select>
      </div>
      {backgroundEditor(bgAnimation)}
      {appSelector()}
    </>
  );

  const tabContents = {
    [Tab.GLOBAL]: tabGlobal,
    [Tab.BUTTON]: tabButton,
  };

  const side = (
    <div className="bg-gray-600 h-full">
      {tabHeader}
      {tabContents[tab]}
    </div>
  );

  return (
    <div className="flex flex-wrap">
      <p style={{ width: 690 }}>{main}</p>
      <p style={{ width: 300 }}>{side}</p>
    </div>
  );
};
