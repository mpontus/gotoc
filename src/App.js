import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from './components/MapView';
import { compose, prop, partial, objOf, pick } from 'ramda'

const GEOLOCATION_TIMEOUT = 2000
const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0045,
  longitudeDelta: 0.0045,
}
const REGION_DELTA = 0.004;

const getClientCoords = () => new Promise((resolve, reject) =>
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      resolve(pos.coords);
    },
    reject,
    {
      enableHighAccuracy: true,
      timeout: GEOLOCATION_TIMEOUT,
    },
  ))

const delay = (ms) => new Promise(
  (resolve) => setTimeout(resolve, ms)
)

const getStartingRegion = () => Promise.race([
  getClientCoords(),
  delay(GEOLOCATION_TIMEOUT),
]).then((pos) => {
  if (!pos) {
    return DEFAULT_REGION;
  }

  return {
    ...DEFAULT_REGION,
    ...pick(['latitude', 'longitude'], pos),
  }
})

export default class App extends React.Component {
  state = {
    region: null,
  }

  componentDidMount() {
    getStartingRegion().then(
      (region) => this.setState({ region }),
    ).catch(console.error)
  }

  handleRegionChange = (region) => {
    this.setState({ region })
  }

  render() {
    const { region } = this.state;

    return (
      <MapView
        region={region}
        onRegionChange={this.handleRegionChange}
      />
    );
  }
}
