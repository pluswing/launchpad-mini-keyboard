interface Props {
  onClick?: () => void
  children: JSX.Element
}
export const BlackButton = ({onClick, children}: Props): JSX.Element => {
  return (
    <div className="w-16 h-16 bg-blue-50 inline-block" onClick={onClick}>
        <div className="w-14 h-14 bg-gray-800 m-1 flex flex-wrap content-center justify-center">
          {children}
        </div>
    </div>
  );
};
