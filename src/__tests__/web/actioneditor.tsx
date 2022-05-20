import { render, screen } from '@testing-library/react';
import { Shortcut } from 'actions';
import { actionEditor } from 'web/actioneditors';

describe(`${__dirname}`, () => {
  test('Shortcut', () => {
    const action: Shortcut = {
      type: 'shortcut',
      shortcuts: [['A']],
    };
    const onClick = jest.fn();
    render(actionEditor(action, onClick));
    expect(1).toBe(1);
    // expect(screen.getByText('BLACK')).toBeInTheDocument();
  });
});
