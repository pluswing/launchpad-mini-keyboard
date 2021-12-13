import { useCallback, useState } from 'react';
import { BlackButton } from './components/BlackButton';
import { Button } from './components/Button';
import { Dialog } from './components/Dialog';
import { Select } from './components/Select';

const api = window.api;

export const App = (): JSX.Element => {
  const [connected, setConnected] = useState(false);
  api.onUpdateMessage({
    connected: () => {
      console.log('connected');
      setConnected(true);
    },
    disconnected: () => {
      console.log('disconnected');
      setConnected(false);
    },
  });

  // dialog
  const [showDialog, setShowDialog] = useState(false);

  const [keys, setKeys] = useState<string[]>([]);
  const [bgColor, setBgColor] = useState(0);

  const onKeyDown = useCallback(
    (e) => {
      console.log(e);
      setKeys([...keys, e.keyCode]);
    },
    [keys]
  );

  const changeTapColor = useCallback(
    (v) => {
      setBgColor(v);
      api.changeBgColor(v);
    },
    [setBgColor]
  );

  return (
    <div className="bg-gray-800 p-6">
      <div
        className="grid grid-cols-9 gap-1"
        style={{ width: '650px', height: '650px' }}
      >
        <BlackButton onClick={() => setShowDialog(true)}>
          <svg
            className="h-8 w-8 text-white"
            style={{ transform: 'rotate(270deg)' }}
            viewBox="0 0 24 24"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="8 6 17 12 8 18 8 6" />
          </svg>
        </BlackButton>
        <BlackButton>
          <svg
            className="h-8 w-8 text-white"
            style={{ transform: 'rotate(90deg)' }}
            viewBox="0 0 24 24"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="8 6 17 12 8 18 8 6" />
          </svg>
        </BlackButton>
        <BlackButton>
          <svg
            className="h-8 w-8 text-white"
            style={{ transform: 'rotate(180deg)' }}
            viewBox="0 0 24 24"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="8 6 17 12 8 18 8 6" />
          </svg>
        </BlackButton>
        <BlackButton>
          <svg
            className="h-8 w-8 text-white"
            style={{ transform: 'rotate(0deg)' }}
            viewBox="0 0 24 24"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="8 6 17 12 8 18 8 6" />
          </svg>
        </BlackButton>

        <BlackButton>
          <span className="text-white text-xs">Session</span>
        </BlackButton>
        <BlackButton>
          <span className="text-white text-xs">Drums</span>
        </BlackButton>
        <BlackButton>
          <span className="text-white text-xs">Keys</span>
        </BlackButton>
        <BlackButton>
          <span className="text-white text-xs">User</span>
        </BlackButton>

        <BlackButton>
          <svg
            className={`h-12 w-12 ${
              connected ? 'text-red-500' : 'text-gray-500'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </BlackButton>

        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <BlackButton>
          <svg
            className="h-6 w-6 text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {' '}
            <path stroke="none" d="M0 0h24v24H0z" />{' '}
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </BlackButton>

        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <BlackButton>
          <svg
            className="h-6 w-6 text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {' '}
            <path stroke="none" d="M0 0h24v24H0z" />{' '}
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </BlackButton>

        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <BlackButton>
          <svg
            className="h-6 w-6 text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {' '}
            <path stroke="none" d="M0 0h24v24H0z" />{' '}
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </BlackButton>

        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <BlackButton>
          <svg
            className="h-6 w-6 text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {' '}
            <path stroke="none" d="M0 0h24v24H0z" />{' '}
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </BlackButton>

        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <BlackButton>
          <svg
            className="h-6 w-6 text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {' '}
            <path stroke="none" d="M0 0h24v24H0z" />{' '}
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </BlackButton>

        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <BlackButton>
          <svg
            className="h-6 w-6 text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {' '}
            <path stroke="none" d="M0 0h24v24H0z" />{' '}
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </BlackButton>

        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <BlackButton>
          <svg
            className="h-6 w-6 text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {' '}
            <path stroke="none" d="M0 0h24v24H0z" />{' '}
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </BlackButton>

        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <BlackButton>
          <span className="text-white text-xs">
            Stop
            <br />
            Solo
            <br />
            Mute
          </span>
        </BlackButton>
      </div>

      <Dialog show={showDialog} onClose={() => setShowDialog(false)}>
        <>
          <input
            type="text"
            placeholder="shortcut key"
            className="p-2 rounded m-2"
          />
          <Select
            prefix="tap color"
            value={bgColor}
            onChange={changeTapColor}
          />
        </>
      </Dialog>

      <br />
      <input type="text" onKeyDown={onKeyDown} />
    </div>
  );
};
