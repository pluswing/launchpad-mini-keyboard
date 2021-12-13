import { range } from './util';

export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface Image {
  width: 9;
  height: 9;
  pixels: Color[][];
}

export const rgb = (r: number, g: number, b: number): Color => {
  return { r, g, b };
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
