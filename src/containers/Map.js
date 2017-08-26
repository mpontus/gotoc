// @flow
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MapView from 'components/MapView';
import ClusterMarker from 'components/ClusterMarker';
import PointMarker from 'components/PointMarker';
import { getRegion, makeGetClusters } from 'reducers/map';
import { regionChange, mapLayout } from 'actions/map';
import type { Region } from 'types/Region';
import type { Cluster } from 'types/Cluster';

/* Types */
type Props = {
  region: Region,
  clusters: Cluster[],
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
          const coordinate = { latitude, longitude };
          const id = properties.cluster ? properties.cluster_id : properties.id;

          return properties.cluster
            ? <ClusterMarker key={id} coordinate={coordinate}>
              {properties.point_count}
            </ClusterMarker>
            : <PointMarker key={id} coordinate={coordinate} />;
        })}
      </MapView>
    );
  }
}

export default enhance(App);
