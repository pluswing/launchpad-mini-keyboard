import { useCallback, useState } from 'react';
// import { LaunchpadApi } from '../preload';
import { BlackButton } from './components/BlackButton';
import { Button } from './components/Button';

export const App = (): JSX.Element => {

  const [keys, setKeys] = useState<string[]>([]);

  const onKeyDown = useCallback((e) => {
    console.log(e)
    setKeys([...keys, e.keyCode])
  }, [keys]);

  const onClickTest = useCallback(() => {
    // @ts-ignore
    const api: LaunchpadApi = window.api;
    console.log(api)
    api.selectColors()
  }, [])

  return (
    <div className="bg-gray-800 p-6">
      <div className="grid grid-cols-9 gap-1" style={{width: "650px", height: "650px"}} >
        <BlackButton onClick={onClickTest}>
          <svg className="h-8 w-8 text-white" style={{transform: "rotate(270deg)"}} viewBox="0 0 24 24"  fill="white"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
          <polygon points="8 6 17 12 8 18 8 6" />
          </svg>
        </BlackButton>
        <BlackButton>
          <svg className="h-8 w-8 text-white" style={{transform: "rotate(90deg)"}} viewBox="0 0 24 24"  fill="white"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
          <polygon points="8 6 17 12 8 18 8 6" />
          </svg>
        </BlackButton>
        <BlackButton>
          <svg className="h-8 w-8 text-white" style={{transform: "rotate(180deg)"}} viewBox="0 0 24 24"  fill="white"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
          <polygon points="8 6 17 12 8 18 8 6" />
          </svg>
        </BlackButton>
        <BlackButton>
          <svg className="h-8 w-8 text-white" style={{transform: "rotate(0deg)"}} viewBox="0 0 24 24"  fill="white"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
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
          <span></span>
        </BlackButton>

        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <BlackButton>
          <svg className="h-6 w-6 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="9 6 15 12 9 18" /></svg>
        </BlackButton>

        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <BlackButton>
          <svg className="h-6 w-6 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="9 6 15 12 9 18" /></svg>
        </BlackButton>

        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <BlackButton>
          <svg className="h-6 w-6 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="9 6 15 12 9 18" /></svg>
        </BlackButton>


        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <BlackButton>
          <svg className="h-6 w-6 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="9 6 15 12 9 18" /></svg>
        </BlackButton>


        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <BlackButton>
          <svg className="h-6 w-6 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="9 6 15 12 9 18" /></svg>
        </BlackButton>


        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <BlackButton>
          <svg className="h-6 w-6 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="9 6 15 12 9 18" /></svg>
        </BlackButton>

        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <BlackButton>
          <svg className="h-6 w-6 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="9 6 15 12 9 18" /></svg>
        </BlackButton>


        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <Button/>
        <BlackButton>
          <span className="text-white text-xs">Stop<br/>Solo<br/>Mute</span>
        </BlackButton>

      </div>

      <br/>
      <input type="text" onKeyDown={onKeyDown}/>
      <pre>
        {keys.map((k) => (
          <span>{ k }<br/></span>
        ))}
      </pre>
    </div>
  );
};
