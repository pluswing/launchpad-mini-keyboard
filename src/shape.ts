import { Color, newImage, Point, setPixel } from './draw';
import { range } from './util';

export interface Circle {
  center: Point;
  r: number;
  color: Color;
}

export const circle = (c: Circle) => {
  const image = newImage();
  const dots = range(360).map((d) => {
    const rad = (d * Math.PI) / 180;
    return {
      x: Math.floor(c.r * Math.cos(rad)) + c.center.x,
      y: Math.floor(c.r * Math.sin(rad)) + c.center.y,
    };
  });
  dots.forEach((d) => {
    setPixel(image, d.x, d.y, c.color);
  });
  return image;
};
