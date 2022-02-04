import { Input, Output } from 'midi';
import {
  copyImage,
  getPixel,
  Image,
  index,
  newImage,
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

const currentIndex = 0;

const onNote = (mode: 'up' | 'down', note: int): void => {
  // 処理を書く
  // indexで指定の色を出す。
  // RGBでindexに紐づいた色を出す。（間違えてる）
  // 他のボタンが押された時に、↑の色を調整する
  const image = newImage();
  setPixel(image, 0, 1, index(currentIndex));

  drawLaunchpad(output, image);
};

const main = async () => {
  initLaunchpad();
};
main();
