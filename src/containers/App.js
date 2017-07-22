// @flow
import type { Map, List } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MapView from '../components/MapView';
import { getRegion } from '../reducers/map';
import { getBusinesses } from '../reducers/businesses';
import { getLocation } from '../reducers/location';
import { regionChange } from '../actions/map';

const REGION_DELTA = 0.4;
const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: REGION_DELTA,
  longitudeDelta: REGION_DELTA,
};

const mapStateToProps = () =>
  createStructuredSelector({
    region: getRegion,
    businesses: getBusinesses,
    location: getLocation,
  });
const mapDispatchToProps = { regionChange };
const enhance = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  location: Map<*, *>,
  region: Map<*, *>,
  businesses: List<*>,
  regionChange: (
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  ) => void,
};

class App extends React.Component<void, Props, void> {
  handleRegionChange = region => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    this.props.regionChange(latitude, longitude, latitudeDelta, longitudeDelta);
  };

  render() {
    const { location, businesses } = this.props;
    const region = { ...DEFAULT_REGION };

    if (location.get('acquired')) {
      const { latitude, longitude } = location.toJS();
      Object.assign(region, { latitude, longitude });
    }

    return (
      <MapView
        region={region}
        businesses={businesses.toArray().map(business => ({
          id: business.get('id'),
          latitude: business.getIn(['coordinates', 'latitude']),
          longitude: business.getIn(['coordinates', 'longitude']),
        }))}
        onRegionChange={this.handleRegionChange}
      />
    );
  }
}

export default enhance(App);
