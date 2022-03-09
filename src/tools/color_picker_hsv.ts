import { Input, Output } from 'midi';
import {
  getPixel,
  hsv,
  Image,
  index,
  newImage,
  rgb,
  setPixel,
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
let currentR = 0;

const onNote = (mode: 'up' | 'down', note: number): void => {
  if (mode == 'down') return;
  const image = newImage();

  const p = toPoint(note);
  if (p.y == 6 && p.x == 0) {
    currentR--;
  }
  if (p.y == 6 && p.x == 1) {
    currentR++;
  }

  let n = 0;
  for (let hue = 0; hue < 360; hue += 15) {
    setPixel(image, Math.floor(n / 8), (n % 8) + 1, hsv(hue, 1, 1));
    n++;
  }

  // const values = [0, 32, 64, 96, 127];
  // [values[currentR]].map((r) => {
  //   values.map((g, x) => {
  //     values.map((b, y) => {
  //       setPixel(image, x, y + 1, rgb(r, g, b));
  //     });
  //   });
  // });

  if (p.y == 1 && p.x == 6) {
    currentIndex--;
  }
  if (p.y == 1 && p.x == 7) {
    currentIndex++;
  }
  console.log([currentR, currentIndex]);
  setPixel(image, 5, 1, index(currentIndex));

  drawLaunchpad(output, image);
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
