const modifierKeyMap: { [key: string]: string } = {
  '⌃': 'control',
  '⌥': 'option',
  '⇧': 'shift',
  '⌘': 'command',
  control: 'control',
  ctrl: 'control',
  alt: 'alt',
  shift: 'shift',
  command: 'command',
  super: 'super',
};

const keyMap: { [key: string]: string } = {
  f1: 'f1',
  f2: 'f2',
  f3: 'f3',
  f4: 'f4',
  f5: 'f5',
  f6: 'f6',
  f7: 'f7',
  f8: 'f8',
  f9: 'f9',
  f10: 'f10',
  f11: 'f11',
  f12: 'f12',
  esc: 'esc',
  return: 'return',
  enter: 'enter',
  delete: 'delete',
  space: 'space',
  tab: 'tab',
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
  home: 'home',
  end: 'end',
  pgup: 'pgup',
  pgdown: 'pgdown',
};

export interface ShortcutKey {
  key: string;
  specialKeys: string[];
}

export const extractKeys = (keys: string[]): ShortcutKey | null => {
  const lk = keys.map((k) => k.toLowerCase());
  const ms = lk.map((k) => modifierKeyMap[k]).filter((k) => k);
  const ks = lk.filter((k) => !Object.keys(modifierKeyMap).includes(k));
  if (!ks) {
    return null;
  }
  const k = ks[0];
  if (k.length > 1 && !keyMap[k]) {
    console.error(`"${k}" is not defined.`);
    return null;
  }
  return {
    key: k,
    specialKeys: ms,
  };
};
