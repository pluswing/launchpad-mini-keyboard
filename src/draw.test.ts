test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});

describe('true is truthy and false is falsy', () => {
  test('true is truthy', () => {
    expect(true).toBe(true);
  });
});

/*
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
*/
