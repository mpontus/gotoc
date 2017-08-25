import React from 'react'; // eslint-disable-line no-unused-vars
import Config from 'react-native-config';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import configureStore from './store';
import YelpApi from './api/yelp';
import config from './config';
import { registerScreens } from './screens';

const api = new YelpApi(Config.YELP_CLIENT_ID, Config.YELP_CLIENT_SECRET);
const store = configureStore(api, config);

registerScreens(store, Provider);

Navigation.startSingleScreenApp({
  screen: {
    screen: 'gotoc.Map',
    title: 'Map',
    navigatorStyle: {
      navBarHidden: true,
    },
  },
});
