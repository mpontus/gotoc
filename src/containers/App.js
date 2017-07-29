// @flow
import React from 'react';
import { connect } from 'react-redux';
import debounce from 'debounce';
import MapView from 'components/MapView';
import { getRegion } from 'reducers/map';
import { getLocation } from 'reducers/location';
import { makeGetClustersInRegion } from 'reducers/points';
import { regionChange } from 'actions/map';
import type { Location } from 'types/Location';
import type { Region } from 'types/Region';
import type { Cluster } from 'types/Cluster';

const scaleRegion = factor => region => {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

  return {
    latitude,
    longitude,
    latitudeDelta: latitudeDelta * factor,
    longitudeDelta: longitudeDelta * factor,
  };
};

const mapStateToProps = () => {
  const getClustersInRegion = makeGetClustersInRegion();

  return state => {
    const region = getRegion(state);
    const smallerRegion = scaleRegion(1.2)(region);
    const location = getLocation(state);
    const clusters = getClustersInRegion(state, { region: smallerRegion });

    return { region, location, clusters };
  };
};
const mapDispatchToProps = { regionChange };
const enhance = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  location: Location,
  region: Region,
  clusters: Cluster[],
  regionChange: (
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  ) => void,
};

class App extends React.Component<void, Props, void> {
  handleRegionChange = debounce(region => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    this.props.regionChange(latitude, longitude, latitudeDelta, longitudeDelta);
  }, 100);

  render() {
    const { region, clusters } = this.props;

    const markers = clusters.map((cluster, index) => ({
      id: index,
      latitude: cluster.latitude,
      longitude: cluster.longitude,
      name: `${cluster.points.length}`,
    }));

    return (
      <MapView
        region={region}
        markers={markers}
        onRegionChange={this.handleRegionChange}
      />
    );
  }
}

export default enhance(App);
