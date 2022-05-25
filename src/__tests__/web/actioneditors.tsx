import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppLaunch, Edge, Mouse, Shortcut } from 'actions';
import { ActionEditor } from 'web/actioneditors';

describe(`${__dirname}`, () => {
  test('action type', async () => {
    const action: Shortcut = {
      type: 'shortcut',
      shortcuts: [['A']],
    };
    const onChange = jest.fn();
    render(<ActionEditor action={action} onChange={onChange} />);
    expect(onChange).toBeCalledTimes(0);

    await userEvent.selectOptions(screen.getAllByRole('combobox')[0], 'mouse');

    expect(onChange).toBeCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      type: 'mouse',
      edge: Edge.TOP_LEFT,
    });

    await userEvent.selectOptions(
      screen.getAllByRole('combobox')[0],
      'applaunch'
    );

    expect(onChange).toBeCalledTimes(2);
    expect(onChange.mock.calls[1][0]).toEqual({
      type: 'applaunch',
      appName: '',
    });

    await userEvent.selectOptions(
      screen.getAllByRole('combobox')[0],
      'shortcut'
    );

    // FIXME なぜかonChangeが呼び出されない
    // expect(onChange).toBeCalledTimes(3);
    // expect(onChange.mock.calls[2][0]).toEqual({
    //   type: 'shortcut',
    //   shortcuts: [[]],
    // });
  });

  test('shortcut', async () => {
    const action: Shortcut = {
      type: 'shortcut',
      shortcuts: [['A']],
    };
    const onChange = jest.fn();
    render(<ActionEditor action={action} onChange={onChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('A');
    expect(screen.getAllByRole('textbox').length).toBe(1);
    expect(screen.getAllByRole('button').length).toBe(2);
    expect(onChange).toBeCalledTimes(0);

    await userEvent.click(screen.getAllByRole('button')[1]);
    expect(onChange).toBeCalledTimes(1);

    expect(onChange.mock.calls[0][0]).toEqual({
      type: 'shortcut',
      shortcuts: [['A'], []],
    });
  });

  test('shortcut multiple', async () => {
    const action: Shortcut = {
      type: 'shortcut',
      shortcuts: [['A'], ['B']],
    };
    const onChange = jest.fn();
    render(<ActionEditor action={action} onChange={onChange} />);
    expect(screen.getAllByRole('textbox').length).toBe(2);
    expect(screen.getAllByRole('button').length).toBe(3);
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('A');
    expect(screen.getAllByRole('textbox')[1]).toHaveValue('B');
    expect(onChange).toBeCalledTimes(0);

    // remove
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(onChange).toBeCalledTimes(1);

    expect(onChange.mock.calls[0][0]).toEqual({
      type: 'shortcut',
      shortcuts: [['B']],
    });
  });

  it('mouse', async () => {
    const action: Mouse = {
      type: 'mouse',
      edge: Edge.TOP_LEFT,
    };
    const onChange = jest.fn();
    render(<ActionEditor action={action} onChange={onChange} />);
    expect(screen.getAllByRole('combobox')[1]).toHaveValue(`${Edge.TOP_LEFT}`);
    expect(onChange).toBeCalledTimes(0);

    await userEvent.selectOptions(
      screen.getAllByRole('combobox')[1],
      `${Edge.BOTTOM_LEFT}`
    );
    expect(onChange).toBeCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      type: 'mouse',
      edge: Edge.BOTTOM_LEFT,
    });
  });

  it('applaunch', async () => {
    const action: AppLaunch = {
      type: 'applaunch',
      appName: '',
    };
    const onChange = jest.fn();
    render(<ActionEditor action={action} onChange={onChange} />);
    expect(screen.getByRole('appname')).toHaveTextContent(`[選択してください]`);
    expect(onChange).toBeCalledTimes(0);

    // mock
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.api = {
      selectFile: async () => {
        return 'SELECT FILE';
      },
    };

    await userEvent.click(screen.getByRole('button'));
    expect(onChange).toBeCalledTimes(1);

    expect(onChange.mock.calls[0][0]).toEqual({
      type: 'applaunch',
      appName: 'SELECT FILE',
    });
  });
});
