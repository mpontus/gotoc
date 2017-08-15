// Inject all operators available from RxJS
import 'rxjs';
import React from 'react';
import Config from 'react-native-config';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './store';
import YelpApi from './api/yelp';
import config from './config';
import './ReactotronConfig';

const api = new YelpApi(Config.YELP_CLIENT_ID, Config.YELP_CLIENT_SECRET);
const store = configureStore(undefined, api, config);

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  const debug = require('./debug').default;

  debug(store);
}

const Root = () =>
  (<Provider store={store}>
    <App />
  </Provider>);

export default Root;
