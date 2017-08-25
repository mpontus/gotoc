// @flow
import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import markerImage from './marker.png';

type PropTypes = {
  children?: React.Element<*>,
};

const defaultProps = {
  children: null,
};

const styles = StyleSheet.create({
  image: {
    // TODO: Use constants for colors
    tintColor: '#FFA726',
    width: 40,
    height: 40,
  },
  view: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
  },
});

const ClusterMarker = ({ children, ...rest }: PropTypes): React.Element<*> =>
  (<Marker {...rest}>
    <Image style={styles.image} source={markerImage} />
    <View style={styles.view}>
      <Text style={styles.text}>
        {children}
      </Text>
    </View>
  </Marker>);

ClusterMarker.defaultProps = defaultProps;

export default ClusterMarker;
