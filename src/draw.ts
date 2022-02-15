import { range } from './util';

export interface RGB {
  type: 'rgb';
  r: number;
  g: number;
  b: number;
}

export interface ColorIndex {
  type: 'index';
  index: number;
}

export type Color = RGB | ColorIndex;

export interface Image {
  width: 9;
  height: 9;
  pixels: Color[][];
}

export const rgb = (r: number, g: number, b: number): Color => {
  return { type: 'rgb', r, g, b };
};

export const index = (colorIndex: number): Color => {
  return { type: 'index', index: colorIndex };
};

export const hsv = (h: number, s: number, v: number): Color => {
  const [r, g, b] = hsv2rgb(h, s, v);
  return { type: 'rgb', r, g, b };
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

export const newImage = (): Image => {
  const width = 9;
  const height = 9;
  const pixels = range(height).map(() => {
    return range(width).map(() => rgb(0, 0, 0));
  });
  return { width, height, pixels };
};

export const getPixel = (image: Image, x: number, y: number): Color => {
  return image.pixels[y][x];
};

export const setPixel = (
  image: Image,
  x: number,
  y: number,
  color: Color
): void => {
  if (outOfRange(image, x, y)) {
    return;
  }
  image.pixels[y][x] = color;
};

const outOfRange = (image: Image, x: number, y: number): boolean => {
  if (x < 0 || y < 0) return true;
  if (x >= image.width || y >= image.height) return true;
  return false;
};

export const toNote = (x: number, y: number): number => {
  return 0x0b + x + 10 * (8 - y);
};

export const toPoint = (note: number): { x: number; y: number } => {
  const x = (note % 10) - 1;
  const y = 9 - (note - (note % 10)) / 10;
  return { x, y };
};

const isBlack = (c: Color): boolean => {
  if (c.type == 'index') {
    return c.index == 0;
  }
  return c.r == 0 && c.g == 0 && c.b == 0;
};

export const stackImage = (image1: Image, image2: Image): Image => {
  const img = newImage();
  range(img.width).forEach((x) => {
    range(img.height).forEach((y) => {
      const a = getPixel(image1, x, y);
      const b = getPixel(image2, x, y);
      if (isBlack(b)) {
        setPixel(img, x, y, a);
      } else {
        setPixel(img, x, y, b);
      }
    });
  });
  return img;
};

export const copyImage = (
  destImage: Image,
  srcImage: Image,
  dx: number,
  dy: number,
  sx: number,
  sy: number,
  sw: number,
  sh: number
): Image => {
  range(sw).forEach((w) => {
    range(sh).forEach((h) => {
      const p = getPixel(srcImage, sx + w, sy + h);
      setPixel(destImage, dx + w, dy + h, p);
    });
  });
  return destImage;
};
