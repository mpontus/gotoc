// @flow
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import type { Marker } from 'components/Map';
import Map from 'components/Map';
import type { Region } from './types';

function noop() {}

type PropTypes = {
  region: Region,
  markers: Marker[],
  debug?: ?React.Element<*>,
  onRegionChange?: (region: Region) => void,
};

const defaultProps = {
  onRegionChange: noop,
  debug: null,
};

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
      {debug &&
      <View style={styles.status}>
        {debug}
      </View>}
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
