// @flow
import R from 'ramda';
import React from 'react';
import { View } from 'react-native';
import { Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
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

const norm = n => (n * 1000).toFixed(2);

class App extends React.Component<void, Props, void> {
  handleRegionChange = region => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    this.props.regionChange(latitude, longitude, latitudeDelta, longitudeDelta);
  };

  renderClusterGrid(region: Region) {
    const { clustering } = this.props;
    const { rows, cols } = clustering;
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    const [minLat, minLng, maxLat, maxLng] = [
      latitude - latitudeDelta / 2,
      longitude - longitudeDelta / 2,
      latitude + latitudeDelta / 2,
      longitude + longitudeDelta / 2,
    ];

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

    console.tron.log(norm(region.longitude - region.longitudeDelta / 2));
    console.tron.log(norm(region.longitude + region.longitudeDelta / 2));
    console.tron.log(vbreaks.map(norm));

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

  renderBoundaries(region: Region) {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    const [minLat, minLng, maxLat, maxLng] = [
      latitude - latitudeDelta / 2,
      longitude - longitudeDelta / 2,
      latitude + latitudeDelta / 2,
      longitude + longitudeDelta / 2,
    ];
    const [nw, ne, sw, se] = [
      { latitude: minLat, longitude: minLng },
      { latitude: minLat, longitude: maxLng },
      { latitude: maxLat, longitude: minLng },
      { latitude: maxLat, longitude: maxLng },
    ];

    return <Polyline coordinates={[nw, ne, se, sw, nw]} strokeColor="#F00" />;
  }

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
      >
        {this.renderClusterGrid(this.props.activeRegion)}
        {this.renderBoundaries(this.props.activeRegion)}
      </MapView>
    );
  }
}

export default enhance(App);
