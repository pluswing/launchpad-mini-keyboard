import { hsv2rgb } from './draw';
import { range } from './util';

const hsv = (h: number, s: number, v: number) => {
  const [r, g, b] = hsv2rgb(h, s, v);
  return [r * 2, g * 2, b * 2];
};

export const COLOR_PALETTE = [
  // 黒〜白
  ...[0, 25, 50, 75, 100].map((v) => {
    return {
      html: hsv(0, 0, (38 + ((100 - 38) * v) / 100) / 100),
      lp: hsv2rgb(0, 0, v / 100),
    };
  }),
  // color
  ...range(360 / 15).map((h) => {
    return {
      html: hsv(h * 15, 0.6, 1),
      lp: hsv2rgb(h * 15, 1, 1),
    };
  }),
];
