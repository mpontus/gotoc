/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';
import Map from './Map';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('gotoc.Map', () => Map, store, Provider);
}
