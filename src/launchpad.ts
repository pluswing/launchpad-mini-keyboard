import { Input, Output } from 'midi';
import { connected } from 'process';
import { COLOR_PALETTE } from './constants';
import { getPixel, Image, newImage, rgb, setPixel, toNote } from './draw';
import { LaunchpadListener } from './ipc';
import { range } from './util';

const HEADER = [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0d];
const DELIMITER = [0xf7];

const input = new Input();
const output = new Output();

export const initLaunchpad = () => {
  let connected = false;

  setInterval(() => {
    console.log('watch connect');
    // 接続監視処理
    const inputIndex = searchMidi(input, 'LPMiniMK3 MIDI');
    const outputIndex = searchMidi(output, 'LPMiniMK3 MIDI');

    console.log(inputIndex, outputIndex);
    if (inputIndex == -1 || outputIndex == -1) {
      if (connected) {
        // 接続が切れた
        disconnect();
      }
      connected = false;
      // 接続されてない
      console.log('not connected');
      return;
    }

    if (connected) {
      return;
    }

    console.log('connected');
    input.openPort(inputIndex);
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

  if (connected) {
    launchpadListener.connected();
  }
};

const init = () => {
  // 設定ファイル読み込み
  // launchpadの初期化
  // ノートが押された時の対応(robotjs)
  // BGのアニメーション
  // ipcMain.emit(IpcKeys.CONNECTED)
  launchpadListener.connected();

  output.sendMessage([
    ...HEADER,
    0x0e, // Programmer / Live mode change
    0x01, // Programmer mode
    ...DELIMITER,
  ]);
};

const disconnect = () => {
  launchpadListener.disconnected();
  input.closePort();
  output.closePort();
};

export const drawLaunchpad = (output: Output, image: Image) => {
  const messages = range(image.width)
    .map((x) => {
      return range(image.height).map((y) => {
        const p = getPixel(image, x, y);
        return [0x03, toNote(x, y), p.r, p.g, p.b];
      });
    })
    .flat();

  output.sendMessage([...HEADER, 0x03, ...messages.flat(), ...DELIMITER]);
};

export const fillColor = (colorIndex: number) => {
  const c = COLOR_PALETTE[colorIndex];
  const image = newImage();
  range(image.width).forEach((x) => {
    range(image.height).forEach((y) => {
      setPixel(image, x, y, rgb(c[0] >> 1, c[1] >> 1, c[2] >> 1));
    });
  });
  drawLaunchpad(output, image);
};

export const listenForSetting = () => {
  input.on('message', (_, message) => {
    console.log('ON MESSAGE', message);
    //             channel, note, velocity
    // message = [ 144, 11, 127 ]
    const [, note, velocity] = message;
    launchpadListener.onNote(velocity == 0 ? 'up' : 'down', note);
  });
};

export const drawCircle = () => {
  const image = newImage();

  const r = 4;
  const x = 4;
  const y = 4;
  const c = rgb(127, 0, 0);

  // 現状実装
  // const dots = range(360).map((d) => {
  //   const rad = (d * Math.PI) / 180;
  //   return [~~(r * Math.cos(rad)) + x, ~~(r * Math.sin(rad)) + y];
  // });
  // dots.forEach((d) => {
  //   setPixel(image, d[0], d[1], c);
  // });

  // ブレゼンハム
  // let cx = 0,
  //   cy = 0,
  //   d = 0;

  // const radius = r;

  // cx = 0;
  // cy = radius;
  // d = 2 - 2 * radius;

  // const hdc = image;
  // const center = { x, y };
  // const col = c;

  // // 開始点の描画
  // setPixel(hdc, cx + center.x, cy + center.y, col); //  (0, R);
  // setPixel(hdc, cx + center.x, -cy + center.y, col); //  (0, -R);
  // setPixel(hdc, cy + center.x, cx + center.y, col); //  (R, 0);
  // setPixel(hdc, -cy + center.x, cx + center.y, col); //  (-R, 0);

  // for (;;) {
  //   if (d > -cy) {
  //     --cy;
  //     d += 1 - 2 * cy;
  //   }

  //   if (d <= cx) {
  //     ++cx;
  //     d += 1 + 2 * cx;
  //   }

  //   if (!cy) break; // 描画終了

  //   // 描画
  //   setPixel(hdc, cx + center.x, cy + center.y, col); // 0～90度の間
  //   setPixel(hdc, -cx + center.x, cy + center.y, col); // 90～180度の間
  //   setPixel(hdc, -cx + center.x, -cy + center.y, col); // 180～270度の間
  //   setPixel(hdc, cx + center.x, -cy + center.y, col); // 270～360度の間
  // }

  // ミッチェナー
  let cx = 0,
    cy = 0,
    d = 0;

  const radius = r;

  d = 3 - 2 * radius;
  cy = radius;

  const hdc = image;
  const center = { x, y };
  const col = c;

  // 開始点の描画
  setPixel(hdc, center.x, radius + center.y, col); // point (0, R);
  setPixel(hdc, center.x, -radius + center.y, col); // point (0, -R);
  setPixel(hdc, radius + center.x, center.y, col); // point (R, 0);
  setPixel(hdc, -radius + center.x, center.y, col); // point (-R, 0);

  for (cx = 0; cx <= cy; cx++) {
    if (d < 0) d += 6 + 4 * cx;
    else d += 10 + 4 * cx - 4 * cy--;

    // 描画
    setPixel(hdc, cy + center.x, cx + center.y, col); // 0-45     度の間
    setPixel(hdc, cx + center.x, cy + center.y, col); // 45-90    度の間
    setPixel(hdc, -cx + center.x, cy + center.y, col); // 90-135   度の間
    setPixel(hdc, -cy + center.x, cx + center.y, col); // 135-180  度の間
    setPixel(hdc, -cy + center.x, -cx + center.y, col); // 180-225  度の間
    setPixel(hdc, -cx + center.x, -cy + center.y, col); // 225-270  度の間
    setPixel(hdc, cx + center.x, -cy + center.y, col); // 270-315  度の間
    setPixel(hdc, cy + center.x, -cx + center.y, col); // 315-360  度の間
  }

  drawLaunchpad(output, image);
};
