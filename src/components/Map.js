// @flow
import React from 'react';
import MapView from 'react-native-maps';

const Map = (props: Object): React.Element<any> =>
  (<MapView
    {...props}
    showsUserLocation
    followsUserLocation
    showsMyLocationButton={false} // inconsistent behavior, see https://github.com/airbnb/react-native-maps/issues/1033
    showsCompass
    showsPointsOfInterest={false}
    loadingEnabled
  />);

export default Map;
