import { useCallback, useState } from 'react';
import { COLOR_PALETTE } from '../../constants';

interface Props {
  prefix: string;
  value: number;
  onChange: (index: number) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export const Select = ({
  prefix,
  value,
  onChange,
  onFocus,
  onBlur,
}: Props): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);

  const toggle = useCallback(() => {
    setOpen(!open);
    !open ? onFocus() : onBlur();
  }, [setOpen, open, onFocus, onBlur]);

  const colors = COLOR_PALETTE.map(
    (c) => `#${c.html.map((v) => v.toString(16).padStart(2, '0')).join('')}`
  );

  const colorList = colors.map((c, i) => {
    return (
      <li onClick={() => onChange(i)} key={i}>
        {i}{' '}
        <span
          className="w-12 h-4 inline-block"
          style={{ backgroundColor: c }}
        />
      </li>
    );
  });

  const selected = (
    <span>
      {value}{' '}
      <span
        className="w-12 h-4 inline-block"
        style={{ backgroundColor: colors[value] }}
      ></span>
    </span>
  );

  return (
    <div
      className={`p-2 rounded m-2 bg-blue-100 ${open ? 'active' : ''}`}
      onClick={toggle}
    >
      <div className="cursor-pointer">
        <span>
          {prefix}: {selected}
        </span>
      </div>
      <ul
        className="p-2 rounded m-3 bg-blue-100 w-40 overflow-hidden overflow-y-scroll max-h-60"
        style={{ display: open ? 'block' : 'none', position: 'absolute' }}
      >
        {colorList}
      </ul>
    </div>
  );
};
