import { COLOR_PALETTE } from '../../color_palette';

interface Props {
  onClick?: () => void;
  color: number;
  selected: boolean;
  children: JSX.Element;
}
export const BlackButton = ({
  onClick,
  color,
  selected,
  children,
}: Props): JSX.Element => {
  const c = COLOR_PALETTE[color].html;
  const cs = `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  return (
    <div className="w-16 h-16 inline-block">
      {selected && (
        <div className="animate-ping absolute m-3 w-10 h-10 bg-blue-50"></div>
      )}

      <div
        className="relative w-16 h-16 bg-blue-50 inline-block"
        style={{ backgroundColor: cs }}
        onClick={onClick}
      >
        <div className="w-14 h-14 bg-gray-800 m-1 flex flex-wrap content-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};
