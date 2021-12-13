import { Output } from 'midi';
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

export const color = (r: number, g: number, b: number): Color => {
  return { r, g, b };
};

export const newImage = (): Image => {
  const width = 9;
  const height = 9;
  const pixels = range(height).map(() => {
    return range(width).map(() => color(0, 0, 0));
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

const toNote = (x: number, y: number): number => {
  return 0x0b + x + 10 * (8 - y);
};

const HEADER = [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0d];
const DELIMITER = [0xf7];
export const draw = (output: Output, image: Image) => {
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
