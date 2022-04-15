import ReactDOM from 'react-dom';

import './tailwind.css';
import { App } from './App';
global.__dirname = ''; // これやらないとエラーになる。。

ReactDOM.render(<App />, document.getElementById('root'));
