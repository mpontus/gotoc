// @flow
import React from 'react';
import { View, Text } from 'react-native';
import { Marker, Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import supercluster from 'supercluster';
import MapView from 'components/MapView';
import { getRegion } from 'reducers/map';
import { getLocation } from 'reducers/location';
import { makeGetBusinessesInRegion } from 'reducers/points';
import { regionChange } from 'actions/map';
import { getRegionEdges, getRegionBoundaries, getZoomLevel } from 'util/map';
import type { Location } from 'types/Location';
import type { Region } from 'types/Region';
import type { Cluster } from 'types/Cluster';

// TODO: remove debug function
const scaleRegion = factor => region => {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

  return {
    latitude,
    longitude,
    latitudeDelta: latitudeDelta * factor,
    longitudeDelta: longitudeDelta * factor,
  };
};

const renderBoundaries = (region: Region) => {
  const [minLng, minLat, maxLng, maxLat] = getRegionEdges(region);

  const [nw, ne, sw, se] = [
    { latitude: minLat, longitude: minLng },
    { latitude: minLat, longitude: maxLng },
    { latitude: maxLat, longitude: minLng },
    { latitude: maxLat, longitude: maxLng },
  ];

  return <Polyline coordinates={[nw, ne, se, sw, nw]} strokeColor="#F00" />;
};

const mapStateToProps = () => {
  const clustering = { rows: 4, cols: 4 };
  const getBusinessesInRegion = makeGetBusinessesInRegion();

  return state => {
    const region = getRegion(state);
    const activeRegion = scaleRegion(0.8)(region);
    const businesses = getBusinessesInRegion(state, { region: activeRegion });
    const location = getLocation(state);
    const index = supercluster({
      radius: 300,
      maxZoom: 16,
    });
    index.load(
      businesses.map(business => {
        const { latitude, longitude } = business.coordinates;

        return {
          type: 'Feature',
          properties: business,
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        };
      }),
    );

    return { region, activeRegion, location, index, clustering, businesses };
  };
};
const mapDispatchToProps = { regionChange };
const enhance = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  location: Location,
  region: Region,
  activeRegion: Region,
  clusters: Cluster[],
  regionChange: (region: Region) => void,
  // TODO: remove debug
  index: any,
  businesses: Array<any>,
};

type State = {
  mapWidth: ?number,
};

class App extends React.Component<void, Props, State> {
  state = {
    mapWidth: null,
  };

  getClusters() {
    const { mapWidth } = this.state;
    const { index, activeRegion: region } = this.props;

    if (!mapWidth || !region) {
      return [];
    }

    const bbox = getRegionEdges(region);
    const zoom = getZoomLevel(region.longitudeDelta, mapWidth);
    const clusters = index.getClusters(bbox, zoom);

    return clusters;
  }

  handleRegionChange = (region: Region) => {
    this.props.regionChange(region);
  };

  handleMapLayout = event => {
    const { width } = event.nativeEvent.layout;

    this.setState({
      mapWidth: width,
    });
  };

  renderDebug() {
    const { mapWidth } = this.state;
    const { region } = this.props;

    if (!mapWidth || !region) {
      return null;
    }

    const { latitude, longitude } = region;
    const latLng = { lat: latitude, lng: longitude };
    const zoom = getZoomLevel(region.longitudeDelta, mapWidth);
    const { westLng, eastLng, northLat, southLat } = getRegionBoundaries(
      latLng,
      zoom,
    );

    return (
      <View>
        <View>
          <Text>
            westLng: {westLng}
          </Text>
        </View>
        <View>
          <Text>
            eastLng: {eastLng}
          </Text>
        </View>
        <View>
          <Text>
            northLat: {northLat}
          </Text>
        </View>
        <View>
          <Text>
            southLat: {southLat}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const { region, businesses } = this.props;
    const clusters = this.getClusters();

    return (
      <MapView
        region={region}
        markers={[]}
        onRegionChange={this.handleRegionChange}
        debug={this.renderDebug()}
        onLayout={this.handleMapLayout}
      >
        {clusters.map(cluster => {
          const { properties, geometry } = cluster;
          const [longitude, latitude] = geometry.coordinates;
          const id = properties.cluster ? properties.cluster_id : properties.id;

          return (
            <Marker
              key={id}
              coordinate={{ latitude, longitude }}
              pinColor="#0000FF"
            />
          );
        })}
        {businesses.map(business => {
          const { id, coordinates } = business;
          const { latitude, longitude } = coordinates;

          return (
            <Marker
              key={id}
              coordinate={{ latitude, longitude }}
              pinColor="#FF0000"
            />
          );
        })}
        {renderBoundaries(scaleRegion(0.95)(region))}
      </MapView>
    );
  }
}

export default enhance(App);
