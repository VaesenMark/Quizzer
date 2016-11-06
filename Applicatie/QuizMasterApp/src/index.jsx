import React from 'react';
import ReactDOM from 'react-dom';

import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import { mainReducer } from './reducers';
import thunk from 'redux-thunk';

import { App } from './components/App';

const logger = (store) => (next) => (action) => {
   return next(action);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;

const theStore = Redux.createStore(mainReducer, composeEnhancers(
  Redux.applyMiddleware(logger, thunk)
));


const mainComponent =
      <ReactRedux.Provider store={theStore}>
         <App/>
      </ReactRedux.Provider>;

ReactDOM.render( mainComponent, document.getElementById('react-root') );

export const store = theStore;

import './websocket'