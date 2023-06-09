import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configureStore';
 
// import "../public/js/main"

// import 'semantic-ui-css/semantic.min.css'


// creating the redux store
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <div></div>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
