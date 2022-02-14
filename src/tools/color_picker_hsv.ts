import { Input, Output } from 'midi';
import { COLOR_PALETTE } from '../constants';
import {
  copyImage,
  getPixel,
  Image,
  index,
  newImage,
  rgb,
  setPixel,
  stackImage,
  toNote,
  toPoint,
} from '../draw';
import { range } from '../util';

const HEADER = [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0d];
const DELIMITER = [0xf7];

const input = new Input();
const output = new Output();
let inputIndex = -1;

export const initLaunchpad = (): void => {
  inputIndex = searchMidi(input, 'LPMiniMK3 MIDI');
  const outputIndex = searchMidi(output, 'LPMiniMK3 MIDI');
  output.openPort(outputIndex);
  init();
};

const searchMidi = (io: Input | Output, search: string): number => {
  const names = range(io.getPortCount()).map((i) => io.getPortName(i));
  return names.findIndex((name) => name.indexOf(search) != -1);
};

const init = () => {
  programmerMode();

  // 一度閉じてから、再度オープンすることで
  // 以前にon("message")していたイベントを無効化する。
  input.closePort();
  input.openPort(inputIndex);
  input.ignoreTypes(false, false, false);
  input.on('message', (_, message) => {
    //             channel, note, velocity
    // message = [ 144, 11, 127 ]
    const [, note, velocity] = message;
    if (note == 0) return;
    onNote(velocity == 0 ? 'up' : 'down', note);
  });
  // init
  onNote('up', 0);
  console.log('INIT');
};

export const programmerMode = () => {
  if (!output.isPortOpen()) {
    return;
  }
  output.sendMessage([
    ...HEADER,
    0x0e, // Programmer / Live mode change
    0x01, // Programmer mode
    ...DELIMITER,
  ]);
};

export const drawLaunchpad = (output: Output, image: Image) => {
  if (!output.isPortOpen()) {
    return;
  }

  const messages = range(image.width)
    .map((x) => {
      return range(image.height).map((y) => {
        const p = getPixel(image, x, y);
        if (p.type == 'rgb') {
          return [0x03, toNote(x, y), p.r, p.g, p.b];
        } else {
          return [0x00, toNote(x, y), p.index];
        }
      });
    })
    .flat();

  output.sendMessage([...HEADER, 0x03, ...messages.flat(), ...DELIMITER]);
};

let currentIndex = 5;
let currentHSV = { h: 0, s: 0, v: 0 };

const onNote = (mode: 'up' | 'down', note: number): void => {
  if (mode == 'down') return;
  // 処理を書く
  // indexで指定の色を出す。
  // RGBでindexに紐づいた色を出す。（間違えてる）
  // 他のボタンが押された時に、↑の色を調整する

  if (note == 61) {
    currentIndex = Math.max(0, currentIndex - 1);
    console.log('CHANGE INDEX:', currentIndex);
  }
  if (note == 62) {
    currentIndex = Math.min(127, currentIndex + 1);
    console.log('CHANGE INDEX:', currentIndex);
  }

  if ([61, 62].includes(note)) {
    currentHSV = { h: 0, s: 1, v: 1 };
  }

  const hDiffs = [40, 30, 20, 10, -10, -20, -30, -40];
  const vDiffs = [0.4, 0.3, 0.2, 0.1, -0.1, -0.2, -0.3, -0.4];

  if (note % 10 == 6) {
    // H
    const v = 8 - Math.floor((note - (note % 10)) / 10);
    if (v >= 0) {
      currentHSV.h = (currentHSV.h + hDiffs[v]) % 360;
      if (currentHSV.h < 0) {
        currentHSV.h = 360 - currentHSV.h;
      }
      console.log('CHANGE COLOR:', currentHSV);
    }
  }
  if (note % 10 == 7) {
    // S
    const v = 8 - Math.floor((note - (note % 10)) / 10);
    if (v >= 0) {
      currentHSV.s = currentHSV.s + vDiffs[v];
      if (currentHSV.s > 1) currentHSV.s = 1.0;
      if (currentHSV.s < 0) currentHSV.s = 0;
      console.log('CHANGE COLOR:', currentHSV);
    }
  }
  if (note % 10 == 8) {
    // V
    const v = 8 - Math.floor((note - (note % 10)) / 10);
    if (v >= 0) {
      currentHSV.v = currentHSV.v + vDiffs[v];
      if (currentHSV.v > 1) currentHSV.v = 1.0;
      if (currentHSV.v < 0) currentHSV.v = 0;
      console.log('CHANGE COLOR:', currentHSV);
    }
  }

  const image = newImage();
  setPixel(image, 0, 1, index(currentIndex));
  const color = hsv2rgb(currentHSV.h, currentHSV.s, currentHSV.v);
  setPixel(image, 1, 1, rgb(color[0], color[1], color[2]));

  hDiffs.forEach((v, i) => {
    let h = (currentHSV.h + v) % 360;
    if (h < 0) h = 360 - h;
    const color = hsv2rgb(h, currentHSV.s, currentHSV.v);
    setPixel(image, 5, i + 1, rgb(color[0], color[1], color[2]));
  });

  vDiffs.forEach((v, i) => {
    let s = currentHSV.s + v;
    if (s > 1) s = 1.0;
    if (s < 0) s = 0;
    const color = hsv2rgb(currentHSV.h, s, currentHSV.v);
    setPixel(image, 6, i + 1, rgb(color[0], color[1], color[2]));

    let _v = currentHSV.v + v;
    if (_v > 1) _v = 1.0;
    if (_v < 0) _v = 0;
    const color2 = hsv2rgb(currentHSV.h, currentHSV.s, _v);
    setPixel(image, 7, i + 1, rgb(color2[0], color2[1], color2[2]));
  });

  setPixel(image, 0, 3, index(2));
  setPixel(image, 1, 3, index(2));

  setPixel(image, 0, 8, index(1));

  drawLaunchpad(output, image);

  if (note == 11) {
    console.log(
      currentIndex,
      currentHSV,
      hsv2rgb(currentHSV.h, currentHSV.s, currentHSV.v)
    );
  }
};

function set(r: number, g: number, b: number) {
  return [Math.round(r * 127), Math.round(g * 127), Math.round(b * 127)];
}

function clamp(v: number, l: number, u: number) {
  return Math.max(l, Math.min(v, u));
}

function hsv2rgb(h: number, s: number, v: number) {
  const out = [0, 0, 0];
  h = h % 360;
  s = clamp(s, 0, 1);
  v = clamp(v, 0, 1);
  if (!s) {
    out[0] = out[1] = out[2] = Math.ceil(v * 127);
    return out;
  }
  const b = (1 - s) * v;
  const vb = v - b;
  const hm = h % 60;
  switch ((h / 60) | 0) {
    case 0:
      return set(v, (vb * h) / 60 + b, b);
    case 1:
      return set((vb * (60 - hm)) / 60 + b, v, b);
    case 2:
      return set(b, v, (vb * hm) / 60 + b);
    case 3:
      return set(b, (vb * (60 - hm)) / 60 + b, v);
    case 4:
      return set((vb * hm) / 60 + b, b, v);
    case 5:
      return set(v, b, (vb * (60 - hm)) / 60 + b);
  }
  return out;
}

const main = async () => {
  initLaunchpad();
};
main();
