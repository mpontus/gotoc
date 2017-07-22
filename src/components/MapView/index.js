// @flow
import React from 'react';
import { View, Text } from 'react-native';
import Map from '../Map';
import styles from './MapView.styles';
import type { Business, Region } from './types';

function noop() {}

function createMarkerFromBusiness(business: Business) {
  const { id, latitude, longitude } = business;

  return { id, latitude, longitude };
}

type PropTypes = {
  region?: Region,
  businesses: Business[],
  onRegionChange?: (region: Region) => void,
};

const defaultProps = {
  region: null,
  onRegionChange: noop,
};

// TODO Refactor, extract Container, Main, Status
const MapView = ({ region, businesses, onRegionChange }: PropTypes) =>
  region
    ? <View style={styles.container}>
      <Map
        style={styles.main}
        region={region}
        onRegionChangeComplete={onRegionChange}
        markers={businesses.map(createMarkerFromBusiness)}
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

MapView.defaultProps = defaultProps;

export default MapView;
