import {
  Action,
  AppLaunch,
  defaultAction,
  Edge,
  Mouse,
  Shortcut,
} from '../actions';
import keycode from 'keycode';

const isMac = () => {
  const ua = window.navigator.userAgent.toUpperCase();
  return ua.indexOf('MAC OS') !== -1;
};

const buildAction = (type: string) => {
  let newAct = defaultAction();
  if (type == 'mouse') {
    newAct = { type: 'mouse', edge: Edge.TOP_LEFT } as Mouse;
  }
  if (type == 'applaunch') {
    newAct = { type: 'applaunch', appName: '' } as AppLaunch;
  }
  return newAct;
};

export const actionEditor = (
  action: Action,
  onChange: (action: Action) => void
): JSX.Element => {
  const changeActionType = (e: any) => {
    const type = e.target.value;
    if (action.type === type) {
      return;
    }
    onChange(buildAction(type));
  };
  return (
    <>
      <div className="flex flex-wrap m-2">
        <select
          id="actionType"
          className="w-full p-3"
          value={action.type}
          onChange={changeActionType}
        >
          <option value="shortcut">キーボードショートカット</option>
          <option value="mouse">マウス操作</option>
          <option value="applaunch">アプリケーション起動</option>
        </select>
      </div>
      {_actionEditor(action, onChange)}
    </>
  );
};

export const _actionEditor = (
  action: Action,
  onChange: (action: Action) => void
): JSX.Element => {
  switch (action.type) {
    case 'shortcut':
      return shortcutEditor(action, onChange);
    case 'mouse':
      return mouseEditor(action, onChange);
    case 'applaunch':
      return appLaunchEditor(action, onChange);
  }
};

export const shortcutEditor = (
  action: Shortcut,
  onChange: (action: Shortcut) => void
) => {
  const add = () => {
    action.shortcuts.push([]);
    onChange(action);
  };

  const remove = (index: number) => {
    action.shortcuts = action.shortcuts.filter((s, i) => i !== index);
    onChange(action);
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
    action.shortcuts[i] = s;
    onChange(action);
  };

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
            onChange={() => 1}
          />
          <button className="m-2" onClick={() => remove(i)}>
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
        <button className="m-2" onClick={add}>
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

export const mouseEditor = (
  action: Mouse,
  onChange: (action: Action) => void
): JSX.Element => {
  const setMouseEdge = (e: any) => {
    const edge = parseInt(e.target.value, 10);
    action.edge = edge;
    onChange(action);
  };

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

export const appLaunchEditor = (
  action: AppLaunch,
  onChange: (action: Action) => void
): JSX.Element => {
  const selectAppLaunchFile = async () => {
    const api = window.api;
    const res = await api.selectFile();
    action.appName = res;
    onChange(action);
  };

  return (
    <div className="flex flex-wrap m-2">
      <div
        className="flex-grow text-gray-100 h-8 w-8 py-3 overflow-x-scroll"
        role="appname"
      >
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
