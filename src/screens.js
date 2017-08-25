/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';
import Map from './containers/App';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('gotoc.Map', () => Map, store, Provider);
}
