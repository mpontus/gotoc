import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { compose, prop, partial, objOf } from 'ramda'

const GEOLOCATION_TIMEOUT = 2000
const DEFAULT_COORDS = {
  latitude: 37.78825,
  longitude: -122.4324,
}

const getClientCoords = () => new Promise((resolve, reject) =>
  navigator.geolocation.getCurrentPosition(
    compose(
      resolve,
      prop('coords')
    ),
    reject,
  ))

const getDelayedDefaultCoords = (ms, defaultCoords) => new Promise(
  compose(
    resolve => setTimeout(resolve, ms),
    resolve => partial(resolve, defaultCoords),
  ))

const getStartingCoords = () => Promise.race([
  getClientCoords,
  getDelayedDefaultCoords(GEOLOCATION_TIMEOUT, DEFAULT_COORDS),
])

export default class App extends React.Component {
  state = {
    startingCoords: null,
  }

  componentDidMount() {
    getStartingCoords().then(
      compose(
        setState,
        objOf('startingCoords'),
      )
    )
  }

  render() {
    const { startingCoords } = this.state;

    // TODO: Refactor
    let map;
    if (startingCoords) {
      const { latitude, longitude } = startingCoords;

      map = (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      )
    } else {
      map = (
        <Text>Loading...</Text>
      )
    }

    return (
      <View style={styles.container}>
        {map}
        <View style={styles.status}>
          <Text>Status is displayed here</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  status: {
    paddingVertical: 10,
    alignItems: 'center',
  }
});
