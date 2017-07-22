// @flow
import React from 'react';
import MapView from 'react-native-maps';

type Marker = {
  latitude: number,
  longitude: number,
};

type Props = {
  markers: Marker[],
};

const Map = ({ markers, ...rest }: Props): React.Element<any> =>
  (<MapView
    {...rest}
    showsUserLocation
    followsUserLocation
    showsMyLocationButton={false} // inconsistent behavior, see https://github.com/airbnb/react-native-maps/issues/1033
    showsCompass
    showsPointsOfInterest={false}
    loadingEnabled
  >
    {markers.map(({ id, latitude, longitude }) =>
      (<MapView.Marker
        key={id}
        coordinate={{ latitude, longitude }}
        title="Foo"
      />),
    )}
  </MapView>);

export default Map;
