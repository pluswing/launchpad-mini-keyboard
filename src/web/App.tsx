import logo from './logo.svg';
import './App.scss';
import { useCallback, useState } from 'react';

export const App = (): JSX.Element => {

  const [keys, setKeys] = useState<string[]>([]);

  const onKeyDown = useCallback((e) => {
    console.log(e)
    setKeys([...keys, e.keyCode])
  }, [keys]);

  return (
    <div className="App">
      <input type="text" onKeyDown={onKeyDown}/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <pre>
          {keys.map((k) => {
            { k }
          })}
        </pre>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};
