// @flow
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Map from '../Map';

type Region = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
};

type PropTypes = {
  region: Region | void,
  onRegionChange: (region: Region) => void,
};

function noop() {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  main: {
    flex: 1,
  },
  status: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const defaultProps = {
  region: null,
  onRegionChange: noop,
};

// TODO Refactor, extract Container, Main, Status
const MapView = ({ region, onRegionChange }: PropTypes) =>
  region
    ? <View style={styles.container}>
      <Map
        style={styles.main}
        region={region}
        onRegionChange={onRegionChange}
      />
      <View style={styles.status}>
        <Text>
            Lat: {region.latitude}, Lng: {region.longitude}
        </Text>
        <Text>
            LatD: {region.latitudeDelta.toFixed(5)}, LngD:{' '}
          {region.longitudeDelta.toFixed(5)}
        </Text>
      </View>
    </View>
    : <View style={styles.container}>
      <View style={styles.main}>
        <Text>Loading...</Text>
      </View>
      <View style={styles.status}>
        <Text>Wait for initial location to load</Text>
      </View>
    </View>;

Object.assign(MapView, { defaultProps });

export default MapView;
