import React from 'react'; // eslint-disable-line no-unused-vars
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import configureStore from './store';
import YelpApi from './api/yelp';
import config from './config';
import { registerScreens } from './screens';

const api = new YelpApi(Config.YELP_CLIENT_ID, Config.YELP_CLIENT_SECRET);
const store = configureStore(api, config);

registerScreens(store, Provider);

async function start() {
  const [mapIcon, listIcon] = await Promise.all([
    Icon.getImageSource('md-navigate', 30),
    Icon.getImageSource('md-list', 30),
  ]);

  Navigation.startTabBasedApp({
    tabs: [
      {
        screen: 'gotoc.List',
        title: 'Venues Near You',
        label: 'Nearby',
        icon: listIcon,
      },
      {
        screen: 'gotoc.Map', // this is a registered name for a screen
        title: 'Gotoc',
        label: 'Map',
        icon: mapIcon,
        navigatorStyle: {
          navBarHidden: true,
        },
      },
    ],
  });
}

start();
