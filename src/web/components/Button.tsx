import { COLOR_PALETTE } from '../../constants';

interface Props {
  onClick?: () => void;
  color: number;
}
export const Button = ({ onClick, color }: Props): JSX.Element => {
  const c = COLOR_PALETTE[color];
  const cs = c
    ? `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
    : '#fff';
  return (
    <div
      className="w-16 h-16 bg-blue-50 inline-block"
      style={{ backgroundColor: cs }}
      onClick={onClick}
    ></div>
  );
};
