import { COLOR_PALETTE } from '../../color_palette';

interface Props {
  onClick?: () => void;
  color: number;
  selected: boolean;
}
export const WhiteButton = ({
  onClick,
  color,
  selected,
}: Props): JSX.Element => {
  const c = COLOR_PALETTE[color].html;
  const cs = `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  return (
    <div className="w-16 h-16 inline-block">
      {selected && (
        <div className="animate-ping absolute m-3 w-10 h-10 bg-blue-50"></div>
      )}
      <div
        className="relative w-16 h-16 bg-blue-50"
        style={{ backgroundColor: cs }}
        onClick={onClick}
      ></div>
    </div>
  );
};
