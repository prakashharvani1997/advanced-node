import 'materialize-css/dist/css/materialize.min.css';
 import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

import axios from 'axios';
window.axios = axios;

const store = createStore(reducers, {}, applyMiddleware(thunk));

import { createRoot } from "react-dom/client";


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  // <StrictMode>
     <Provider store={store}>
  <App />
</Provider>
  // </StrictMode>
);
