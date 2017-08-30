/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';
import Map from './Map';
import List from './List';
import Details from './BusinessDetailsScreen';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('gotoc.Map', () => Map, store, Provider);
  Navigation.registerComponent('gotoc.List', () => List, store, Provider);
  Navigation.registerComponent('gotoc.Details', () => Details, store, Provider);
}
