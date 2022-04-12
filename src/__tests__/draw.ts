import {
  copyImage,
  fillImage,
  getPixel,
  hsv,
  index,
  newImage,
  rgb,
  setPixel,
  stackImage,
  toNote,
  toPoint,
} from 'draw';

describe(`${__filename}`, () => {
  test('colors', () => {
    expect(rgb(0, 1, 2)).toEqual({
      type: 'rgb',
      r: 0,
      g: 1,
      b: 2,
    });

    expect(index(3)).toEqual({
      type: 'index',
      index: 3,
    });

    expect(hsv(0, 1, 1)).toEqual(rgb(127, 0, 0));
    expect(hsv(360, 1, 1)).toEqual(rgb(127, 0, 0));

    expect(hsv(90, 1, 1)).toEqual(rgb(64, 127, 0));
    expect(hsv(180, 1, 1)).toEqual(rgb(0, 127, 127));
    expect(hsv(270, 1, 1)).toEqual(rgb(64, 0, 127));

    expect(hsv(0, 0.5, 1)).toEqual(rgb(127, 64, 64));
    expect(hsv(0, 0, 1)).toEqual(rgb(127, 127, 127));

    expect(hsv(0, 1, 0.5)).toEqual(rgb(64, 0, 0));
    expect(hsv(0, 1, 0)).toEqual(rgb(0, 0, 0));
  });

  it('image', () => {
    const image = newImage();
    expect(image.width).toBe(9);
    expect(image.height).toBe(9);
    expect(image.pixels.length).toBe(9);
    expect(image.pixels[0].length).toBe(9);
    expect(image.pixels[8].length).toBe(9);

    expect(getPixel(image, 0, 0)).toEqual(rgb(0, 0, 0));
    expect(getPixel(image, 1, 0)).toEqual(rgb(0, 0, 0));
    setPixel(image, 0, 0, rgb(127, 0, 0));
    expect(getPixel(image, 0, 0)).toEqual(rgb(127, 0, 0));
    expect(getPixel(image, 1, 0)).toEqual(rgb(0, 0, 0));

    setPixel(image, -1, 0, rgb(127, 0, 0));
    setPixel(image, 0, -1, rgb(127, 0, 0));
    setPixel(image, image.width, 0, rgb(127, 0, 0));
    setPixel(image, 0, image.height, rgb(127, 0, 0));

    const black = rgb(0, 0, 0);
    expect(getPixel(image, -1, 0)).toEqual(black);
    expect(getPixel(image, 0, -1)).toEqual(black);
    expect(getPixel(image, image.width, 0)).toEqual(black);
    expect(getPixel(image, 0, image.height)).toEqual(black);
  });

  it('toNote/toPoint', () => {
    expect(toNote(0, 0)).toBe(91);
    expect(toNote(1, 0)).toBe(92);
    expect(toNote(1, 1)).toBe(82);

    expect(toPoint(91)).toEqual({ x: 0, y: 0 });
    expect(toPoint(92)).toEqual({ x: 1, y: 0 });
    expect(toPoint(82)).toEqual({ x: 1, y: 1 });
  });

  it('image control', () => {
    const red = rgb(127, 0, 0);
    const image = fillImage(red);
    expect(getPixel(image, 0, 0)).toEqual(red);
    expect(getPixel(image, 8, 8)).toEqual(red);

    const image2 = newImage();
    copyImage(image2, image, 1, 1, 0, 0, 3, 3);

    const black = rgb(0, 0, 0);
    expect(getPixel(image2, 0, 0)).toEqual(black);
    expect(getPixel(image2, 1, 1)).toEqual(red);
    expect(getPixel(image2, 2, 2)).toEqual(red);
    expect(getPixel(image2, 3, 3)).toEqual(red);
    expect(getPixel(image2, 4, 4)).toEqual(black);

    const blue = rgb(0, 0, 127);
    const image3 = fillImage(blue);
    const image4 = stackImage(image3, image2);
    expect(getPixel(image4, 0, 0)).toEqual(blue);
    expect(getPixel(image4, 1, 1)).toEqual(red);
    expect(getPixel(image4, 2, 2)).toEqual(red);
    expect(getPixel(image4, 3, 3)).toEqual(red);
    expect(getPixel(image4, 4, 4)).toEqual(blue);

    expect(getPixel(image3, 0, 0)).toEqual(blue);
    expect(getPixel(image3, 1, 1)).toEqual(blue);
    expect(getPixel(image3, 2, 2)).toEqual(blue);
    expect(getPixel(image3, 3, 3)).toEqual(blue);
    expect(getPixel(image3, 4, 4)).toEqual(blue);
  });
});
