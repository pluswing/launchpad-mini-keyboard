import { RegisterApplication } from 'ipc';

interface Props {
  app: string;
  appList: RegisterApplication[];
  onChange: (apppath: string) => void;
  onRemove: () => void;
  onAdd: () => void;
}

export const AppSelector = ({
  app,
  appList,
  onChange,
  onRemove,
  onAdd,
}: Props) => {
  const changeApp = async (e: any) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-wrap m-2">
      <select
        id="appSelect"
        className="w-full p-3"
        value={app}
        onChange={changeApp}
      >
        <option value="">DEFAULT</option>
        {appList.map((a) => (
          <option key={a.apppath} value={a.apppath}>
            {a.apppath}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap w-full justify-end">
        <button className="m-2" onClick={onRemove}>
          <svg
            className="h-8 w-8 text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="flex flex-wrap justify-end">
          <button className="m-2" onClick={onAdd}>
            <svg
              className="h-8 w-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
