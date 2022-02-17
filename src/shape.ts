import { imageResource } from '@nut-tree/nut-js';
import { fchmod } from 'fs';
import { Color, newImage, Point, setPixel, stackImage } from './draw';
import { range } from './util';

export interface Circle {
  center: Point;
  r: number;
  color: Color;
}

export const filledCircle = (c: Circle) => {
  return range(Math.floor(c.r + 1)).reduce((img, r) => {
    return stackImage(img, circleB({ ...c, r }));
  }, newImage());
};

export const circle = (c: Circle) => {
  const image = newImage();
  const dots = range(360).map((d) => {
    const rad = (d * Math.PI) / 180;
    return {
      x: Math.trunc(c.r * Math.cos(rad)) + c.center.x,
      y: Math.trunc(c.r * Math.sin(rad)) + c.center.y,
    };
  });
  dots.forEach((d) => {
    setPixel(image, d.x, d.y, c.color);
  });
  return image;
};

export const circleB = (c: Circle) => {
  // ブレゼンハム
  let cx = 0,
    cy = 0,
    d = 0;

  const radius = c.r;

  cx = 0;
  cy = radius;
  d = 2 - 2 * radius;

  const hdc = newImage();
  const center = c.center;
  const col = c.color;

  // 開始点の描画
  setPixel(hdc, cx + center.x, cy + center.y, col); //  (0, R);
  setPixel(hdc, cx + center.x, -cy + center.y, col); //  (0, -R);
  setPixel(hdc, cy + center.x, cx + center.y, col); //  (R, 0);
  setPixel(hdc, -cy + center.x, cx + center.y, col); //  (-R, 0);

  for (;;) {
    if (d > -cy) {
      --cy;
      d += 1 - 2 * cy;
    }

    if (d <= cx) {
      ++cx;
      d += 1 + 2 * cx;
    }

    if (cy <= 0) break; // 描画終了

    // 描画
    setPixel(hdc, cx + center.x, cy + center.y, col); // 0～90度の間
    setPixel(hdc, -cx + center.x, cy + center.y, col); // 90～180度の間
    setPixel(hdc, -cx + center.x, -cy + center.y, col); // 180～270度の間
    setPixel(hdc, cx + center.x, -cy + center.y, col); // 270～360度の間
  }
  return hdc;
};
