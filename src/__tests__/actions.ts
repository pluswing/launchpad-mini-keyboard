import { defaultAction } from 'actions';

describe(`${__filename}`, () => {
  test('defaultAction', () => {
    expect(defaultAction()).toEqual({
      type: 'shortcut',
      shortcuts: [[]],
    });
  });
});
