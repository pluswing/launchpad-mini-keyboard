import { COLOR_PALETTE } from "../../constants";

interface Props {
  onClick?: () => void;
  color: number,
  children: JSX.Element;
}
export const BlackButton = ({ onClick, color, children }: Props): JSX.Element => {
  const c = COLOR_PALETTE[color]
  const cs = `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`
  return (
    <div className="w-16 h-16 bg-blue-50 inline-block" style={{backgroundColor: cs}} onClick={onClick}>
      <div className="w-14 h-14 bg-gray-800 m-1 flex flex-wrap content-center justify-center">
        {children}
      </div>
    </div>
  );
};
