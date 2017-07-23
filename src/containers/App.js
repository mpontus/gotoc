// @flow
import type { Map, List } from 'immutable';
import React from 'react';
import { pick } from 'ramda';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MapView from '../components/MapView';
import { getRegion } from '../reducers/map';
import { getBusinesses } from '../reducers/businesses';
import { getLocation } from '../reducers/location';
import { regionChange } from '../actions/map';

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
    const { businesses } = this.props;
    const region = pick([
      'latitude',
      'longitude',
      'latitudeDelta',
      'longitudeDelta',
    ])(this.props.region.toJS());

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
