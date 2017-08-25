// @flow
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import markerImage from './diamond.png';

const styles = StyleSheet.create({
  image: {
    // TODO: Use constants for colors
    tintColor: 'blue',
    width: 15,

    height: 30,

    // resizeMode: 'stretch',
  },
});

const PointMarker = (props: Object): React.Element<*> =>
  (<Marker {...props}>
    <Image style={styles.image} source={markerImage} />
  </Marker>);

export default PointMarker;
