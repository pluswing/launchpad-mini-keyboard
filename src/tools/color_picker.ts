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
let currentRGB = { r: 0, g: 0, b: 0 };

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
    const [_r, _g, _b] = COLOR_PALETTE[currentIndex];
    const r = _r >> 1;
    const g = _g >> 1;
    const b = _b >> 1;
    currentRGB = { r, g, b };
  }

  const diffs = [-25, -10, -5, -1, 1, 5, 10, 25];

  const c = (v: number) => {
    if (v < 0) return 0;
    if (v > 127) return 127;
    return v;
  };

  if (note % 10 == 6) {
    // R
    const v = 8 - Math.floor((note - (note % 10)) / 10);
    if (v >= 0) {
      currentRGB.r = c(currentRGB.r + diffs[v]);
    }
  }
  if (note % 10 == 7) {
    // G
    const v = 8 - Math.floor((note - (note % 10)) / 10);
    if (v >= 0) {
      currentRGB.g = c(currentRGB.g + diffs[v]);
    }
  }
  if (note % 10 == 8) {
    // B
    const v = 8 - Math.floor((note - (note % 10)) / 10);
    if (v >= 0) {
      currentRGB.b = c(currentRGB.b + diffs[v]);
    }
  }

  const image = newImage();
  setPixel(image, 0, 1, index(currentIndex));
  setPixel(image, 1, 1, rgb(currentRGB.r, currentRGB.g, currentRGB.b));

  diffs.forEach((v, i) => {
    setPixel(
      image,
      5,
      i + 1,
      rgb(c(currentRGB.r + v), currentRGB.g, currentRGB.b)
    );
    setPixel(
      image,
      6,
      i + 1,
      rgb(currentRGB.r, c(currentRGB.g + v), currentRGB.b)
    );
    setPixel(
      image,
      7,
      i + 1,
      rgb(currentRGB.r, currentRGB.g, c(currentRGB.b + v))
    );
  });

  setPixel(image, 0, 3, index(2));
  setPixel(image, 1, 3, index(2));

  setPixel(image, 0, 8, index(1));

  drawLaunchpad(output, image);

  if (note == 11) {
    console.log(currentRGB);
  }
};

const main = async () => {
  initLaunchpad();
};
main();
