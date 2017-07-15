import React from 'react';
import MapView from 'react-native-maps';

const Map = (props) => {
  return (
    <MapView
      {...props}
      showsUserLocation={true}
      followsUserLocation={true}
      showsMyLocationButton={false} // inconsistent behavior, see https://github.com/airbnb/react-native-maps/issues/1033
      showsCompass={true}
      showsPointsOfInterest={false}
      loadingEnabled={true}
    />
  )
}

export default Map;
