import { Color, newImage, Point, setPixel } from './draw';
import { range } from './util';

export interface Circle {
  center: Point;
  r: number;
  color: Color;
}

const unique = (list: number[]): number[] => {
  return [...new Set(list)];
};

export const filledCircle = (c: Circle) => {
  const points = circleBPints(c);
  const image = newImage();
  points.forEach((p) => {
    setPixel(image, p.x, p.y, c.color);
  });

  const xList = unique(points.map((p) => p.x));
  xList.forEach((x) => {
    const ys = points.filter((p) => p.x == x).map((p) => p.y);
    const count = ys.length;
    if (count <= 1) return;
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    for (let y = minY; y <= maxY; y++) {
      setPixel(image, x, y, c.color);
    }
  });
  return image;
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
  const image = newImage();
  circleBPints(c).forEach((p) => {
    setPixel(image, p.x, p.y, c.color);
  });
  return image;
};

const circleBPints = (c: Circle): Point[] => {
  // ブレゼンハム
  let cx = 0,
    cy = 0,
    d = 0;

  const radius = Math.ceil(c.r);

  cx = 0;
  cy = radius;
  d = 2 - 2 * radius;

  const center = c.center;

  const points: Point[] = [];

  // 開始点の描画
  points.push({ x: cx + center.x, y: cy + center.y }); //  (0, R);
  points.push({ x: cx + center.x, y: -cy + center.y }); //  (0, -R);
  points.push({ x: cy + center.x, y: cx + center.y }); //  (R, 0);
  points.push({ x: -cy + center.x, y: cx + center.y }); //  (-R, 0);

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
    points.push({ x: cx + center.x, y: cy + center.y }); // 0～90度の間
    points.push({ x: -cx + center.x, y: cy + center.y }); // 90～180度の間
    points.push({ x: -cx + center.x, y: -cy + center.y }); // 180～270度の間
    points.push({ x: cx + center.x, y: -cy + center.y });
  }
  return points;
};
