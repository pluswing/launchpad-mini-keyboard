import { useCallback, useEffect, useState } from 'react';
import { toPoint } from '../draw';
import {
  Action,
  actionGrid,
  AppLaunch,
  defaultAction,
  Edge,
  Mouse,
} from '../actions';
import { Select } from './components/Select';
import {
  BackgroundAnimation,
  defaultAnimationData,
  noneAnimation,
} from '../backgrounds';
import { RegisterApplication } from 'ipc';
import {
  Button,
  DOWN,
  LEFT,
  RIGHT,
  UP,
  SESSION,
  DRUMS,
  KEYS,
  USER,
  ICON,
  WHITE,
  DISCLOSURE,
  STOP_SOLO_MUTE,
  drawButton,
} from './components/Buttons';
import { colorGrid } from '../color_palette';
import { actionEditor } from './actioneditors';
import { backgroundEditor } from './backgroundeditor';
import { appSelector } from './appselector';
import { setCurrentApplication } from 'store';

const api = window.api;

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

const highlightTab = (b: boolean) =>
  b ? 'bg-gray-200 border-blue-400' : 'bg-gray-400 border-gray-500';

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
    api.loadSetting().then((data) => {
      setActions(data.actions);
      setBgColors(data.bgColors);
      setTapColors(data.tapColors);
      setBgAnimation(data.bgAnimation);
      setAppList(data.registerApplications);
    });
  }, []);

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
            const selected = current.x == x && current.y == y;
            const color = colors[y][x];
            return drawButton(b, color, selected, connected, () => {
              showButtonSetting(x, y);
            });
          });
        })}
      </div>
    </div>
  );

  const setTabPage = (tab: Tab) => {
    setTab(tab);
    api.changePage(tab == Tab.GLOBAL ? 'global' : 'button');
  };

  // TODO
  const tabHeader = (
    <div className="flex flex-wrap text-center">
      <div
        id="globalTab"
        onClick={() => setTabPage(Tab.GLOBAL)}
        className={`w-1/2 border-b-2 py-2 ${highlightTab(tab == Tab.GLOBAL)}`}
      >
        GLOBAL
      </div>
      <div
        id="buttonTab"
        onClick={() => setTabPage(Tab.BUTTON)}
        className={`w-1/2 border-b-2 py-2 ${highlightTab(tab == Tab.BUTTON)}`}
      >
        BUTTON
      </div>
    </div>
  );

  const actionEditorOnChange = (action: Action) => {
    setAction({ ...action });
    actions[current.y][current.x] = { ...action };
    setActions([...actions]);
    api.changeAction(current.x, current.y, action);
  };

  const tabButton = (
    <>
      <div className="flex flex-wrap m-2">
        <select
          id="actionType"
          className="w-full p-3"
          value={action.type}
          onChange={setActionType}
        >
          <option value="shortcut">キーボードショートカット</option>
          <option value="mouse">マウス操作</option>
          <option value="applaunch">アプリケーション起動</option>
        </select>
      </div>
      {actionEditor(actionEditorOnChange, action)}
      <Select prefix="tap color" value={tapColor} onChange={changeTapColor} />
      <Select prefix="bg color" value={bgColor} onChange={changeBgColor} />
    </>
  );

  const changeBgAnimationType = (e: any) => {
    const type = e.target.value;
    const newBgAnim = defaultAnimationData(type);
    setBgAnimation(newBgAnim);
    api.changeBgAnimation(newBgAnim);
  };

  const [appList, setAppList] = useState([] as RegisterApplication[]);
  const [currentApp, setCurrentApp] = useState('');

  const onChangeBgAnimation = (bgAnim: BackgroundAnimation): void => {
    setBgAnimation(bgAnim);
    api.changeBgAnimation(bgAnim);
  };

  const onChangeAppSelector = async (apppath: string) => {
    setCurrentApp(apppath);
    api.setCurrentApplication(apppath);
    // const data = await api.setCurrentApplication(apppath);
    // // loadSettingをもう一回やる？ => これ採用。
    // setActions(data.actions);
    // setBgColors(data.bgColors);
    // setTapColors(data.tapColors);
    // setBgAnimation(data.bgAnimation);
    // setAppList(data.registerApplications);
  };

  const onRemoveAppSelector = (apppath: string): void => {
    const list = [...appList.filter((a) => a.apppath !== apppath)];
    api.removeApplication(apppath);
    setAppList(list);
    setCurrentApp('');
    api.setCurrentApplication('');
  };

  const onAddAppSelector = async (): Promise<void> => {
    const api = window.api;
    const path = await api.selectFile();
    if (!path) return;
    await api.addApplication(path);
    const data = await api.setCurrentApplication(currentApp);
    setAppList(data.registerApplications);
  };

  const tabGlobal = (
    <>
      {appSelector(
        appList,
        currentApp,
        onChangeAppSelector,
        onRemoveAppSelector,
        onAddAppSelector
      )}
      <div className="w-full border-t-2 border-b-2 border-gray-200"></div>
      <div className="flex flex-wrap m-2">
        <select
          id="bgAnimationType"
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
      {backgroundEditor(bgAnimation, onChangeBgAnimation)}
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
