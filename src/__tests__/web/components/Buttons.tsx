import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, drawButton } from 'web/components/Buttons';

describe(`${__dirname}`, () => {
  test('black', () => {
    const buton: Button = {
      type: 'black',
      content: <div>BLACK</div>,
    };
    render(drawButton(buton, 0, false, false, () => 1));
    expect(screen.getByText('BLACK')).toBeInTheDocument();
    // TODO BlackButtonが描画されているかを確認したい。
  });

  test('icon connected', () => {
    const button: Button = {
      type: 'icon',
      f: (connected) => <div>ICON {connected ? 'true' : 'false'}</div>,
    };
    render(drawButton(button, 0, false, true, () => 1));
    expect(screen.getByText('ICON true')).toBeInTheDocument();

    render(drawButton(button, 0, false, false, () => 1));
    expect(screen.getByText('ICON false')).toBeInTheDocument();
  });

  test('white', () => {
    const button: Button = {
      type: 'white',
    };
    const { container } = render(drawButton(button, 0, false, false, () => 1));
    expect(container.getElementsByClassName('animate-ping').length).toBe(0);

    const { container: container2 } = render(
      drawButton(button, 0, true, false, () => 1)
    );
    expect(container2.getElementsByClassName('animate-ping').length).toBe(1);
  });

  test('click', async () => {
    const button: Button = {
      type: 'white',
    };
    const onClick = jest.fn();
    render(drawButton(button, 0, false, false, onClick));
    expect(onClick).toBeCalledTimes(0);
    await userEvent.click(screen.getByRole('top_view'));
    expect(onClick).toBeCalledTimes(1);
  });
});
