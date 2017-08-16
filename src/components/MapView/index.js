// @flow
import React from 'react';
import { View, Text } from 'react-native';
import type { Marker } from 'components/Map';
import Map from 'components/Map';
import styles from './MapView.styles';
import type { Region } from './types';

function noop() {}

type PropTypes = {
  region?: ?Region,
  markers: Marker[],
  debug?: ?React.Element<*>,
  onRegionChange?: (region: Region) => void,
};

const defaultProps = {
  region: null,
  onRegionChange: noop,
  debug: null,
};

// TODO Refactor, extract Container, Main, Status
const MapView = ({
  region,
  markers,
  onRegionChange,
  debug,
  ...rest
}: PropTypes) =>
  region
    ? <View style={styles.container}>
      <Map
        style={styles.main}
        region={region}
        onRegionChange={onRegionChange}
        markers={markers}
        {...rest}
      />
      <View style={styles.status}>
        {debug}
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
