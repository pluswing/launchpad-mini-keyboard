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
