import { useCallback, useState } from 'react';
// import { LaunchpadApi } from '../preload';
import { BlackButton } from './components/BlackButton';
import { Button } from './components/Button';
import { Dialog } from './components/Dialog';


const COLOR_PALETTE = [
  [0x61, 0x61, 0x61],
  [0xb3, 0xb3, 0xb3],
  [0xdd, 0xdd, 0xdd],
  [0xff, 0xff, 0xff],
  [0xf4, 0xb6, 0xb5],
  [0xed, 0x6c, 0x67],
  [0xce, 0x68, 0x65],
  [0xa8, 0x65, 0x63],
  [0xfd, 0xf3, 0xd8],
  [0xf4, 0xb6, 0x6f],
  [0xd2, 0x90, 0x69],
  [0xaa, 0x79, 0x65],
  [0xfc, 0xef, 0xaa],
  [0xff, 0xff, 0x7b],
  [0xdd, 0xdd, 0x74],
  [0xb3, 0xb3, 0x6c],
  [0xe4, 0xfe, 0xab],
  [0xcf, 0xfd, 0x79],
  [0xae, 0xdb, 0x72],
  [0x8c, 0xb2, 0x6a],
  [0xcf, 0xfd, 0xba],
  [0x8f, 0xfc, 0x77],
  [0x83, 0xda, 0x70],
  [0x75, 0xb1, 0x6a],
  [0xcf, 0xfd, 0xc7],
  [0x8f, 0xfc, 0x98],
  [0x83, 0xda, 0x81],
  [0x75, 0xb1, 0x72],
  [0xcf, 0xfd, 0xd0],
  [0x8f, 0xfc, 0xcf],
  [0x83, 0xda, 0xa6],
  [0x75, 0xb1, 0x85],
  [0xcf, 0xfd, 0xf3],
  [0x8f, 0xfc, 0xe9],
  [0x83, 0xda, 0xc3],
  [0x75, 0xb1, 0x98],
  [0xcc, 0xf2, 0xfd],
  [0x89, 0xeb, 0xfc],
  [0x7b, 0xc5, 0xda],
  [0x70, 0x9f, 0xb1],
  [0xc7, 0xdc, 0xfc],
  [0x7b, 0xc5, 0xfa],
  [0x70, 0x9f, 0xd8],
  [0x68, 0x80, 0xaf],
  [0x9e, 0x8d, 0xf8],
  [0x61, 0x61, 0xf6],
  [0x61, 0x61, 0xd6],
  [0x61, 0x61, 0xae],
  [0xc8, 0xb4, 0xfa],
  [0x98, 0x64, 0xf6],
  [0x7c, 0x62, 0xd6],
  [0x73, 0x62, 0xae],
  [0xf4, 0xb6, 0xfa],
  [0xed, 0x6c, 0xf8],
  [0xce, 0x68, 0xd7],
  [0xa8, 0x65, 0xaf],
  [0xf4, 0xb6, 0xd4],
  [0xed, 0x6c, 0xbe],
  [0xce, 0x68, 0x9f],
  [0xa8, 0x65, 0x8a],
  [0xee, 0x7e, 0x68],
  [0xe1, 0xb5, 0x6e],
  [0xd9, 0xc3, 0x6f],
  [0xa1, 0xa1, 0x69],
  [0x75, 0xb1, 0x6a],
  [0x75, 0xb1, 0x8f],
  [0x6a, 0x8b, 0xcf],
  [0x61, 0x61, 0xf6],
  [0x75, 0xb1, 0xb2],
  [0x86, 0x63, 0xeb],
  [0xc8, 0xb4, 0xc1],
  [0x88, 0x77, 0x80],
  [0xed, 0x6c, 0x67],
  [0xf5, 0xff, 0xac],
  [0xf1, 0xfc, 0x7a],
  [0xd6, 0xfe, 0x79],
  [0x90, 0xdb, 0x71],
  [0x8f, 0xfc, 0xcf],
  [0x87, 0xe6, 0xfc],
  [0x70, 0x9f, 0xf8],
  [0x86, 0x63, 0xf6],
  [0xbe, 0x67, 0xf4],
  [0xe1, 0x91, 0xd9],
  [0x9a, 0x78, 0x64],
  [0xf2, 0xa5, 0x6d],
  [0xe2, 0xf8, 0x79],
  [0xdd, 0xfe, 0x9a],
  [0x8f, 0xfc, 0x77],
  [0xc3, 0xfd, 0xaa],
  [0xd6, 0xfb, 0xd8],
  [0xc3, 0xfd, 0xf6],
  [0xd1, 0xe3, 0xfc],
  [0xa7, 0xc1, 0xf2],
  [0xd2, 0xc3, 0xf5],
  [0xea, 0x91, 0xf9],
  [0xed, 0x6c, 0xc8],
  [0xf6, 0xc4, 0x71],
  [0xf2, 0xee, 0x77],
  [0xe9, 0xfe, 0x7a],
  [0xda, 0xcd, 0x71],
  [0xb0, 0xa2, 0x69],
  [0x77, 0xb8, 0x7c],
  [0x88, 0xc0, 0x90],
  [0x81, 0x81, 0x9e],
  [0x83, 0x8c, 0xc7],
  [0xc6, 0xab, 0x86],
  [0xce, 0x68, 0x65],
  [0xef, 0xb6, 0xa4],
  [0xef, 0xbd, 0x80],
  [0xfd, 0xf3, 0x99],
  [0xec, 0xf8, 0xab],
  [0xda, 0xed, 0x86],
  [0x81, 0x81, 0x9e],
  [0xf9, 0xf9, 0xd9],
  [0xe3, 0xfb, 0xe6],
  [0xe9, 0xe9, 0xfd],
  [0xe1, 0xd6, 0xfc],
  [0xb3, 0xb3, 0xb3],
  [0xd5, 0xd5, 0xd5],
  [0xfa, 0xff, 0xff],
  [0xd9, 0x69, 0x65],
  [0xa0, 0x65, 0x63],
  [0x9e, 0xf3, 0x75],
  [0x75, 0xb1, 0x6a],
  [0xf2, 0xee, 0x77],
  [0xb0, 0xa2, 0x69],
  [0xe7, 0xc4, 0x70],
  [0xb7, 0x7a, 0x65],
]

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

  window.api.sendMessage("CCC").then((value) => {
    console.log("sendMessage Response", value)
  })

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

      <Dialog show={true}>
        <>
          <div>Button Setting</div>
          <input type="text" placeholder="shortcut key"/>
          <br/>
          <select>
            <option value="red">red</option>
            <option value="green">green</option>
          </select>
        </>
      </Dialog>

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
