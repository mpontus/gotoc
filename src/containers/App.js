// @flow
import React from 'react';
import { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MapView from 'components/MapView';
import { getRegion, makeGetClusters } from 'reducers/map';
import { regionChange, mapLayout } from 'actions/map';
import type { Region } from 'types/Region';
import type { Business } from 'types/Business';

type Cluster = {|
  cluster: true,
  cluster_id: number,
|};

type Feature = {
  type: 'Feature',
  properties: Cluster | (Business & { cluster: false }),
  geometry: {
    type: 'Point',
    coordinates: number[],
  },
};

/* Types */
type Props = {
  region: Region,
  clusters: Feature[],
  regionChange: (region: Region) => void,
  mapLayout: (layout: { width: number, height: number }) => void,
};

type LayoutEvent = Event & {
  nativeEvent: {
    layout: {
      width: number,
      height: number,
    },
  },
};

/* Component */
const mapStateToProps = () =>
  createStructuredSelector({
    region: getRegion,
    clusters: makeGetClusters(),
  });

const enhance = connect(mapStateToProps, { regionChange, mapLayout });

class App extends React.Component<void, Props, void> {
  handleRegionChange = (region: Region) => {
    this.props.regionChange(region);
  };

  handleLayout = (event: LayoutEvent) => {
    const { width, height } = event.nativeEvent.layout;

    this.props.mapLayout({ width, height });
  };

  render() {
    const { region, clusters } = this.props;

    return (
      <MapView
        region={region}
        markers={[]}
        onRegionChange={this.handleRegionChange}
        onLayout={this.handleLayout}
      >
        {clusters.map(cluster => {
          const { properties, geometry } = cluster;
          const [longitude, latitude] = geometry.coordinates;
          const id = properties.cluster ? properties.cluster_id : properties.id;

          return (
            <Marker
              key={id}
              coordinate={{ latitude, longitude }}
              pinColor="#FF0000"
            />
          );
        })}
      </MapView>
    );
  }
}

export default enhance(App);
