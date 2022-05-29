import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Direction, NoneAnimation } from 'backgrounds';
import { BackgroundEditor } from 'web/backgroundeditor';

describe(`${__dirname}`, () => {
  test('animation type', async () => {
    const bgAnim: NoneAnimation = {
      type: 'none',
    };
    const onChange = jest.fn();
    render(<BackgroundEditor bgAnim={bgAnim} onChange={onChange} />);
    expect(onChange).toBeCalledTimes(0);

    await userEvent.selectOptions(
      screen.getAllByRole('combobox')[0],
      'rainbow'
    );

    expect(onChange).toBeCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      type: 'rainbow',
      interval: 20,
      saturation: 1,
      value: 1,
      direction: Direction.LEFT,
    });
  });
});
