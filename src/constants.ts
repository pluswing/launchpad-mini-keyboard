import { hsv2rgb } from './draw';
import { range } from './util';

const hsv = (h: number, s: number, v: number) => {
  const [r, g, b] = hsv2rgb(h, s, v);
  return [r * 2, g * 2, b * 2];
};

export const COLOR_PALETTE = [
  // 黒〜白
  ...[0, 25, 50, 75, 100].map((v) => hsv(0, 0, v / 100)),
  // color
  ...range(360 / 15).map((h) => hsv(h * 15, 1, 1)),
];
