import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, prop, partial, objOf, pick } from 'ramda';
import MapView from '../components/MapView';
import { getRegion } from '../reducers/map';
import { regionChange } from '../actions/map';

const GEOLOCATION_TIMEOUT = 2000;
const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0045,
  longitudeDelta: 0.0045
};
const REGION_DELTA = 0.004;

const getClientCoords = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      pos => {
        resolve(pos.coords);
      },
      reject,
      {
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT
      }
    )
  );

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getStartingRegion = () =>
  Promise.race([getClientCoords(), delay(GEOLOCATION_TIMEOUT)]).then(pos => {
    if (!pos) {
      return DEFAULT_REGION;
    }

    return {
      ...DEFAULT_REGION,
      ...pick(['latitude', 'longitude'], pos)
    };
  });

const mapStateToProps = () =>
  createStructuredSelector({
    region: getRegion
  });
const mapDispatchToProps = { regionChange };
const enhance = connect(mapStateToProps, mapDispatchToProps);

class App extends React.Component {
  componentDidMount() {
    getStartingRegion()
      .then(region => {
        const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

        this.props.regionChange(
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta
        );
      })
      .catch(console.error);
  }

  handleRegionChange = region => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    this.props.regionChange(latitude, longitude, latitudeDelta, longitudeDelta);
  };

  render() {
    const { region } = this.props;
    const regionProp =
      region &&
      pick(
        ['latitude', 'longitude', 'latitudeDelta', 'longitudeDelta'],
        region.toJS()
      );

    return (
      <MapView region={regionProp} onRegionChange={this.handleRegionChange} />
    );
  }
}

export default enhance(App);
