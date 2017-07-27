// @flow
import React from 'react';
import { connect } from 'react-redux';
import MapView from 'components/MapView';
import { getRegion } from 'reducers/map';
import { getLocation } from 'reducers/location';
import { makeGetBusinessesInRegion } from 'reducers/points';
import { regionChange } from 'actions/map';
import type { Location } from 'types/Location';
import type { Region } from 'types/Region';
import type { Business } from 'types/Business';

const mapStateToProps = () => {
  const getBusinessesInRegion = makeGetBusinessesInRegion();

  return state => {
    const region = getRegion(state);
    const location = getLocation(state);
    const businesses = getBusinessesInRegion(state, { region });

    return { region, location, businesses };
  };
};
const mapDispatchToProps = { regionChange };
const enhance = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  location: Location,
  region: Region,
  businesses: Business[],
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
    const { region, businesses } = this.props;

    return (
      <MapView
        region={region}
        businesses={businesses.map(business => ({
          ...business,
          ...business.coordinates,
        }))}
        onRegionChange={this.handleRegionChange}
      />
    );
  }
}

export default enhance(App);
