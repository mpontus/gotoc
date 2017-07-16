// @flow
import React from 'react';
import { View, Text } from 'react-native';
import Map from '../Map';
import styles from './MapView.style';

function noop() {}

const defaultProps = {
  region: null,
  onRegionChange: noop,
};

type Region = {
  latitude: number,
  longitude: number,
  latudeDelta: number,
  longitudeDelta: number,
};

type PropTypes = {
  region: Region,
  onRegionChange: (region: Region) => void,
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
