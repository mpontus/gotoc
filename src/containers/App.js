// @flow
import R from 'ramda';
import React from 'react';
import { Text } from 'react-native';
import { Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import MapView from 'components/MapView';
import { getRegion } from 'reducers/map';
import { getLocation } from 'reducers/location';
import { makeGetClustersInRegion } from 'reducers/points';
import { regionChange } from 'actions/map';
import { getRegionBoundaries, getZoomLevel } from 'util/map';
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
  const clustering = { rows: 4, cols: 4 };
  const getClustersInRegion = makeGetClustersInRegion();

  return state => {
    const region = getRegion(state);
    const activeRegion = scaleRegion(0.8)(region);
    const location = getLocation(state);
    const clusters = getClustersInRegion(state, { region: activeRegion });

    return { region, activeRegion, location, clusters, clustering };
  };
};
const mapDispatchToProps = { regionChange };
const enhance = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  location: Location,
  region: Region,
  activeRegion: Region,
  clusters: Cluster[],
  regionChange: (
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  ) => void,
  clustering: {
    rows: number,
    cols: number,
  },
};

type State = {
  mapWidth: ?number,
};

const renderBoundaries = (region: Region) => {
  const [minLng, minLat, maxLng, maxLat] = getRegionBoundaries(region);

  const [nw, ne, sw, se] = [
    { latitude: minLat, longitude: minLng },
    { latitude: minLat, longitude: maxLng },
    { latitude: maxLat, longitude: minLng },
    { latitude: maxLat, longitude: maxLng },
  ];

  return <Polyline coordinates={[nw, ne, se, sw, nw]} strokeColor="#F00" />;
};

class App extends React.Component<void, Props, State> {
  state = {
    mapWidth: null,
  };

  handleRegionChange = region => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    this.props.regionChange(latitude, longitude, latitudeDelta, longitudeDelta);
  };

  handleMapLayout = event => {
    const { width } = event.nativeEvent.layout;

    this.setState({
      mapWidth: width,
    });
  };

  renderClusterGrid(region: Region) {
    const { clustering } = this.props;
    const { rows, cols } = clustering;
    const [minLng, minLat, maxLng, maxLat] = getRegionBoundaries(region);

    const [hbreaks, vbreaks] = [
      [region.latitude, region.latitudeDelta, rows],
      [region.longitude, region.longitudeDelta, cols],
    ].map(([center, delta, cells]) => {
      const halfDelta = delta / 2;
      const [min, max] = [-1, +1].map(n => n * halfDelta).map(n => n + center);
      const span = Math.abs((max - min) / cells);
      const offset = Math.abs(min % span);
      const breakpoints = R.range(0)(cells)
        .map(n => n * span)
        .map(n => n + min + offset);

      return breakpoints;
    });

    const vlines = vbreaks.map(lng => ({
      id: `lng:${lng}`,
      coordinates: [
        { latitude: minLat, longitude: lng },
        { latitude: maxLat, longitude: lng },
      ],
    }));

    const hlines = hbreaks.map(lat => ({
      id: `lat:${lat}`,
      coordinates: [
        { latitude: lat, longitude: minLng },
        { latitude: lat, longitude: maxLng },
      ],
    }));

    return [...vlines, ...hlines].map(({ id, coordinates }) =>
      <Polyline key={id} coordinates={coordinates} />,
    );
  }

  render() {
    const { region, clusters } = this.props;
    const { mapWidth } = this.state;

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
        debug={
          region && mapWidth
            ? <Text>
              {getZoomLevel(region, mapWidth)}
            </Text>
            : null
        }
        onLayout={this.handleMapLayout}
      >
        {this.renderClusterGrid(this.props.activeRegion)}
        {renderBoundaries(this.props.activeRegion)}
      </MapView>
    );
  }
}

export default enhance(App);
