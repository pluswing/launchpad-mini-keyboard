import assert from 'assert';
import { index, rgb } from 'draw';

describe('draw', () => {
  it('rgb', () => {
    assert.deepStrictEqual(rgb(0, 1, 2), {
      type: 'rgb',
      r: 0,
      g: 1,
      b: 2,
    });
  });

  it('index', () => {
    assert.deepStrictEqual(index(3), {
      type: 'index',
      index: 3,
    });
  });
});
