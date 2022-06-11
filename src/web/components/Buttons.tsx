import { BlackButton } from './BlackButton';
import { WhiteButton } from './WhiteButton';

interface Black {
  type: 'black';
  content: JSX.Element;
}

interface Icon {
  type: 'icon';
  f: (connected: boolean) => JSX.Element;
}

interface White {
  type: 'white';
}

export type Button = Black | Icon | White;

export const UP: Button = {
  type: 'black',
  content: (
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
  ),
};

export const DOWN: Button = {
  type: 'black',
  content: (
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
  ),
};

export const LEFT: Button = {
  type: 'black',
  content: (
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
  ),
};

export const RIGHT: Button = {
  type: 'black',
  content: (
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
  ),
};

export const SESSION: Button = {
  type: 'black',
  content: <span className="text-white text-xs">Session</span>,
};

export const DRUMS: Button = {
  type: 'black',
  content: <span className="text-white text-xs">Drums</span>,
};

export const KEYS: Button = {
  type: 'black',
  content: <span className="text-white text-xs">Keys</span>,
};

export const USER: Button = {
  type: 'black',
  content: <span className="text-white text-xs">User</span>,
};

export const ICON: Button = {
  type: 'icon',
  f: (connected: boolean) => (
    <svg
      className={`h-12 w-12 ${connected ? 'text-red-500' : 'text-gray-500'}`}
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
  ),
};

export const DISCLOSURE: Button = {
  type: 'black',
  content: (
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
      <path stroke="none" d="M0 0h24v24H0z" />
      <polyline points="9 6 15 12 9 18" />
    </svg>
  ),
};

export const STOP_SOLO_MUTE: Button = {
  type: 'black',
  content: (
    <span className="text-white text-xs">
      Stop
      <br />
      Solo
      <br />
      Mute
    </span>
  ),
};

export const WHITE: Button = {
  type: 'white',
};

export const drawButton = (
  button: Button,
  color: number,
  selected: boolean,
  connected: boolean,
  onClick: () => void
): JSX.Element => {
  switch (button.type) {
    case 'black':
      return (
        <BlackButton onClick={onClick} color={color} selected={selected}>
          {button.content}
        </BlackButton>
      );
    case 'icon':
      return (
        <BlackButton onClick={onClick} color={color} selected={selected}>
          {button.f(connected)}
        </BlackButton>
      );
    case 'white':
      return (
        <WhiteButton onClick={onClick} color={color} selected={selected} />
      );
  }
};
