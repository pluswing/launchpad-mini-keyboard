import keycode from 'keycode';
import { useCallback, useEffect, useState } from 'react';
import { toPoint } from '../draw';
import { range } from '../util';
import { BlackButton } from './components/BlackButton';
import { Button as WhiteButton } from './components/Button';
import { Dialog } from './components/Dialog';
import { Select } from './components/Select';

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
const listGrid = (): string[][][] => range(9).map(() => range(9).map(() => []));

export const App = (): JSX.Element => {
  const [connected, setConnected] = useState(false);
  const [onDown, setOnDown] = useState(false);

  const [selectionColorPage, setSelectionColorPage] = useState(0);

  api.onUpdateMessage({
    connected: async () => {
      setConnected(true);
    },
    disconnected: () => {
      setConnected(false);
    },
    onNote: (event, note) => {
      const p = toPoint(note);

      if (selectingColorType != ColorType.NONE) {
        // 色選択モード
        if (p.x == 2 && p.y == 0) {
          // left key
          api.changeSelectingColorPage(0);
          setSelectionColorPage(0);
        }
        if (p.x == 3 && p.y == 0) {
          // right key
          api.changeSelectingColorPage(1);
          setSelectionColorPage(1);
        }
        if (p.y == 0 || p.x == 8) {
          // 無視する
          return;
        }
        const index = p.x + (p.y - 1) * 8 + 64 * selectionColorPage;
        if (selectingColorType == ColorType.BG_COLOR) {
          changeBgColor(index);
          reloadDialog();
          return;
        }
        if (selectingColorType == ColorType.TAP_COLOR) {
          changeTapColor(index);
          reloadDialog();
          return;
        }
      }

      if (event == 'up') {
        setOnDown(false);
        showButtonSetting(p.x, p.y);
      } else if (event == 'down') {
        setShowDialog(false);
        setOnDown(true);
      }
    },
  });

  const reloadDialog = () => {
    setShowDialog(false);
    setShowDialog(true);
  };

  // on mounted
  useEffect(() => {
    api.ready();
    api.loadSetting().then((data) => {
      setShortcuts(data.shortcuts);
      setBgColors(data.bgColors);
      setTapColors(data.tapColors);
    });
  }, []);

  // data
  const [shortcuts, setShortcuts] = useState(listGrid());
  const [bgColors, setBgColors] = useState(colorGrid());
  const [tapColors, setTapColors] = useState(colorGrid());

  // dialog
  const [showDialog, setShowDialog] = useState(false);
  const [current, setCurrent] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const showButtonSetting = (x: number, y: number) => {
    setCurrent({ x, y });
    setShortcut(shortcuts[y][x]);
    setBgColor(bgColors[y][x]);
    setTapColor(tapColors[y][x]);
    setShowDialog(true);
  };

  const [shortcut, setShortcut] = useState<string[]>([]);
  const [bgColor, setBgColor] = useState(0);
  const [tapColor, setTapColor] = useState(0);

  const onKeyDown = useCallback(
    (e) => {
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
        e.ctrlKey ? '⌃' : '',
        e.altKey ? '⌥' : '',
        e.shiftKey ? '⇧' : '',
        e.metaKey ? '⌘' : '',
        keycode(e).toUpperCase(),
      ].filter((v) => v);

      setShortcut(s);

      shortcuts[current.y][current.x] = s;
      setShortcuts([...shortcuts]);
      api.changeShortcut(current.x, current.y, s);
    },
    [setShortcut, setShortcuts, shortcuts, current]
  );

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

  enum ColorType {
    NONE,
    TAP_COLOR,
    BG_COLOR,
  }
  const [selectingColorType, setSelectingColorType] = useState(ColorType.NONE);
  // selecting Color
  const onFocusTapColor = () => {
    setSelectingColorType(ColorType.TAP_COLOR);
    setSelectionColorPage(0);
    api.enterSelectingColor();
  };
  const onFocusBgColor = () => {
    setSelectingColorType(ColorType.BG_COLOR);
    setSelectionColorPage(0);
    api.enterSelectingColor();
  };
  const onBlurColorSelect = () => {
    setSelectingColorType(ColorType.NONE);
    api.leaveSelectingColor();
  };

  const colors = onDown ? tapColors : bgColors;

  return (
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

      <Dialog show={showDialog} onClose={() => setShowDialog(false)}>
        <>
          <input
            type="text"
            value={shortcut.join('')}
            onKeyDown={onKeyDown}
            placeholder="shortcut key"
            className="p-2 rounded m-2"
          />
          {showDialog ? (
            <>
              <Select
                prefix="tap color"
                value={tapColor}
                onFocus={onFocusTapColor}
                onBlur={onBlurColorSelect}
                onChange={changeTapColor}
              />
              <Select
                prefix="bg color"
                value={bgColor}
                onFocus={onFocusBgColor}
                onBlur={onBlurColorSelect}
                onChange={changeBgColor}
              />
            </>
          ) : (
            ''
          )}
        </>
      </Dialog>
    </div>
  );
};
