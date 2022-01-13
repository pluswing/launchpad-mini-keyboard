import { Input, Output } from 'midi';
import {
  getPixel,
  Image,
  index,
  newImage,
  setPixel,
  toNote,
  toPoint,
} from './draw';
import { LaunchpadListener } from './ipc';
import { getBgColors, getTapColors } from './preferenecs';
import { range } from './util';

const HEADER = [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0d];
const DELIMITER = [0xf7];

const input = new Input();
const output = new Output();
let inputIndex = -1;
let connected = false;

export const initLaunchpad = (): NodeJS.Timer => {
  return setInterval(() => {
    // 接続監視処理
    inputIndex = searchMidi(input, 'LPMiniMK3 MIDI');
    const outputIndex = searchMidi(output, 'LPMiniMK3 MIDI');

    if (inputIndex == -1 || outputIndex == -1) {
      if (connected) {
        // 接続が切れた
        disconnect();
      }
      connected = false;
      inputIndex = -1;
      // 接続されてない
      return;
    }

    if (connected) {
      return;
    }

    output.openPort(outputIndex);
    connected = true;

    // 初期化処理
    init();
  }, 1000);
};

const searchMidi = (io: Input | Output, search: string): number => {
  const names = range(io.getPortCount()).map((i) => io.getPortName(i));
  return names.findIndex((name) => name.indexOf(search) != -1);
};

let launchpadListener: LaunchpadListener = {
  connected: () => 1,
  disconnected: () => 1,
  onNote: () => 1,
};

export const setLaunchpadListener = (listener: LaunchpadListener): void => {
  launchpadListener = listener;

  console.log('setLaunchpadListener', connected);
  if (connected) {
    launchpadListener.connected();
  }
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
    launchpadListener.onNote(velocity == 0 ? 'up' : 'down', note);
  });

  launchpadListener.connected();
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

export const liveMode = () => {
  if (!output.isPortOpen()) {
    return;
  }
  output.sendMessage([
    ...HEADER,
    0x0e, // Programmer / Live mode change
    0x00,
    ...DELIMITER,
  ]);
};

const disconnect = () => {
  input.closePort();
  output.closePort();
  launchpadListener.disconnected();
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

export const applyLaunchpad = () => {
  applyLaunchpadByIndexes(getBgColors());
};

const applyLaunchpadByIndexes = (indexes: number[][]) => {
  const image = newImage();
  indexes.forEach((line, y) =>
    line.forEach((c, x) => setPixel(image, x, y, index(c)))
  );
  drawLaunchpad(output, image);
};

export const eventLaunchpad = (event: 'up' | 'down', note: number) => {
  const p = toPoint(note);
  if (event == 'up') {
    applyLaunchpad();
  } else {
    const t = getTapColors();
    const c = t[p.y][p.x];
    const b = getBgColors();
    b[p.y][p.x] = c;
    applyLaunchpadByIndexes(b);
  }
};

export const selectingColor = (page: number) => {
  const image = newImage();
  range(64).forEach((i) => {
    const x = 0;
    const y = 0;
    setPixel(image, x, y, index(i * page));
  });
  drawLaunchpad(output, image);
};

/*
(x=0, y=1)
0, 1, 2, 3, 4, 5, 6, 7, 8
9, 10 ...
*/
