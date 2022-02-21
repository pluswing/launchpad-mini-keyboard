import { Input, Output } from 'midi';
import {
  copyImage,
  fillImage,
  getPixel,
  hsv,
  Image,
  index,
  newImage,
  Point,
  rgb,
  setPixel,
  stackImage,
  toNote,
  toPoint,
} from './draw';
import { LaunchpadListener } from './ipc';
import { circle, filledCircle } from './shape';
import { getBgColors, getTapColors } from './store';
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
    ANIMATION_DEFINITION['rainbow'].onNote(p);
  }
};

let animation: NodeJS.Timer | null = null;
const startAnimation = (fn: () => void, fps = 30) => {
  stopAnimation();
  animation = setInterval(fn, 1000 / fps);
};
const stopAnimation = () => {
  if (animation) {
    clearInterval(animation);
  }
  animation = null;
};

export const selectingColor = (page: number) => {
  const page1 = newImage();
  const page2 = newImage();
  range(64).forEach((i) => {
    const x = i % 8;
    const y = Math.floor(i / 8) + 1;
    setPixel(page1, x, y, index(i));
    setPixel(page2, x, y, index(i + 64));
  });

  const control = newImage();
  setPixel(control, 2, 0, index(page == 0 ? 1 : 3));
  setPixel(control, 3, 0, index(page == 1 ? 1 : 3));

  let offset = 0;
  startAnimation(() => {
    const image = newImage();
    offset += 1;
    if (page == 0) {
      copyImage(image, page1, offset - 8, 0, 0, 0, 9, 9);
      copyImage(image, page2, offset, 0, 0, 0, 9, 9);
    } else {
      copyImage(image, page1, 0 - offset, 0, 0, 0, 9, 9);
      copyImage(image, page2, 8 - offset, 0, 0, 0, 9, 9);
    }
    if (offset >= 8) {
      range(9).forEach((y) => {
        setPixel(image, 8, y, index(0));
      });
      stopAnimation();
    }
    drawLaunchpad(output, stackImage(image, control));
  });
};

export const startBackgroundAnimation = () => {
  ANIMATION_DEFINITION['rainbow'].background();
};

const createBgButtonColorImage = (): Image => {
  const image = newImage();
  getBgColors().forEach((line, y) =>
    line.forEach((c, x) => setPixel(image, x, y, index(c)))
  );
  return image;
};

const rainbowBackground = () => {
  stopAnimation();
  let step = 0;
  startAnimation(() => {
    const image = createRainbowImage(step, 30, 1, 1, Direction.LEFT);
    const control = createBgButtonColorImage();
    drawLaunchpad(output, stackImage(image, control));
    step = (step + 1) % 127;
  }, 10);
};
/**
 *
 * @param step アニメーションステップ
 * @param interval 色相の変化度 (0 - 360まで。)
 * @param saturation 彩度 (0:くすんだ色, 1:あざやか)
 * @param value 明るさ (0:暗い, 1:明るい)
 * @param r
 * @returns
 */
const createRainbowImage = (
  step: number,
  interval: number,
  saturation: number,
  value: number,
  r: Direction
): Image => {
  const image = newImage();

  const colors = range(8).map((i) => {
    const h = ((i + step) * interval) % 360;
    return hsv(h, saturation, value);
  });

  range(8).forEach((x) => {
    range(9).forEach((y) => {
      if (y == 0) return;
      switch (r) {
        case 0: // 左に動く
          setPixel(image, x, y, colors[x]);
          break;
        case 1: // 上に動く
          setPixel(image, x, y, colors[y - 1]);
          break;
        case 2: // 右に動く
          setPixel(image, x, y, colors[7 - x]);
          break;
        case 3: // 下に動く
          setPixel(image, x, y, colors[8 - y]);
          break;
      }
    });
  });
  return image;
};

export const stopBackgroundAnimation = () => {
  stopAnimation();
};

const defaultOnNote = (p: Point) => {
  const t = getTapColors();
  const c = t[p.y][p.x];
  const b = getBgColors();
  b[p.y][p.x] = c;
  applyLaunchpadByIndexes(b);
};

const waterdrop = (p: Point) => {
  stopAnimation(); // FIXME 仮置き。複数アニメの合成
  let step = 0;
  startAnimation(() => {
    step += 1;
    if (step >= 10) {
      if (step >= 13) {
        stopAnimation();
        applyLaunchpad();
      }
      return;
    }

    // 円を描画する
    const image = filledCircle({
      center: p,
      r: step / 3.5,
      color: rgb(0, 127, 0),
    });
    const control = createBgButtonColorImage();
    drawLaunchpad(output, stackImage(image, control));
  }, 30);
};

// 静的
const staticBackground = () => {
  const image = fillImage(rgb(0, 0, 64));
  const control = createBgButtonColorImage();
  drawLaunchpad(output, stackImage(image, control));
};

// 呼吸
const breathBackground = () => {
  stopAnimation();

  let step = 0;
  startAnimation(() => {
    step = (step + 5) % 360;
    const r = (step * Math.PI) / 180;
    const c = hsv(0, 1, Math.sin(r) / 2 + 0.5);
    const image = fillImage(c);
    const control = createBgButtonColorImage();
    drawLaunchpad(output, stackImage(image, control));
  });
};

enum Direction {
  LEFT,
  UP,
  RIGHT,
  DOWN,
}

interface AnimDef {
  background: () => void;
  onNote: (p: Point) => void;
}

const ANIMATION_DEFINITION: { [key: string]: AnimDef } = {
  none: {
    background: () => 1,
    onNote: defaultOnNote,
  },
  rainbow: {
    background: rainbowBackground,
    onNote: defaultOnNote,
  },
  staticColor: {
    background: staticBackground,
    onNote: defaultOnNote,
  },
  breath: {
    background: breathBackground,
    onNote: defaultOnNote,
  },
  waterdrop: {
    background: () => 1,
    onNote: waterdrop,
  },
};
