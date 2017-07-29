// @flow
import React from 'react';
import MapView from 'react-native-maps';

export type Marker = {
  id: number | string,
  name: string,
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
    {markers.map(({ id, name, latitude, longitude }) =>
      (<MapView.Marker
        key={id}
        coordinate={{ latitude, longitude }}
        title={name}
      />),
    )}
  </MapView>);

export default Map;
