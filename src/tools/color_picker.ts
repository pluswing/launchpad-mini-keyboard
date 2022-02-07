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

const onNote = (mode: 'up' | 'down', note: number): void => {
  if (mode == 'down') return;
  // 処理を書く
  // indexで指定の色を出す。
  // RGBでindexに紐づいた色を出す。（間違えてる）
  // 他のボタンが押された時に、↑の色を調整する

  if (note == 61) {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    console.log('CHANGE INDEX:', currentIndex);
  }
  if (note == 62) {
    currentIndex++;
    if (currentIndex > 127) {
      currentIndex = 127;
    }
    console.log('CHANGE INDEX:', currentIndex);
  }

  const [_r, _g, _b] = COLOR_PALETTE[currentIndex];
  const r = _r >> 1;
  const g = _g >> 1;
  const b = _b >> 1;

  const image = newImage();
  setPixel(image, 0, 1, index(currentIndex));
  setPixel(image, 1, 1, rgb(r, g, b));

  const c = (v: number) => {
    if (v < 0) return 0;
    if (v > 127) return 127;
    return v;
  };

  [-10, -5, -1, 1, 5, 10].forEach((v, i) => {
    setPixel(image, 5, i + 1, rgb(c(r + v), g, b));
    setPixel(image, 6, i + 1, rgb(r, c(g + v), b));
    setPixel(image, 7, i + 1, rgb(r, g, c(b + v)));
  });

  setPixel(image, 0, 3, index(2));
  setPixel(image, 1, 3, index(2));

  drawLaunchpad(output, image);
};

const main = async () => {
  initLaunchpad();
};
main();
