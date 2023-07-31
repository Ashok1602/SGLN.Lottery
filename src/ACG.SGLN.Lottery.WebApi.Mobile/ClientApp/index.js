/**
 * @format
 */
import React from 'react';
import 'react-native-gesture-handler'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import rootReducer from './src/redux/index';
import {applyMiddleware, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

const RNRedux = () => (
  <Provider store={createStoreWithMiddleware(rootReducer)}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
