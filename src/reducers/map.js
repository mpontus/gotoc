// @flow
import { Map } from 'immutable';
import { pick } from 'ramda';
import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import type { Config } from 'types/Config';
import { getDeltasForRadius } from 'util/geo';
import { REGION_CHANGE } from '../actions/map';

function getInitialState(config: Config) {
  const { defaultLatitude, defaultLongitude, defaultRadius } = config;
  const {
    latitude: latitudeDelta,
    longitude: longitudeDelta,
  } = getDeltasForRadius(defaultLatitude, defaultLongitude, defaultRadius);

  return Map({
    default: true,
    latitude: defaultLatitude,
    longitude: defaultLongitude,
    latitudeDelta,
    longitudeDelta,
  });
}

const mapReducerFactory = (config: Config) =>
  handleActions(
    {
      [REGION_CHANGE]: (state, action) => {
        const { region } = action.payload;

        return Map({
          default: false,
          ...pick(
            ['latitude', 'longitude', 'latitudeDelta', 'longitudeDelta'],
            region,
          ),
        });
      },
    },
    getInitialState(config),
  );

export default mapReducerFactory;

export const getRegion = createSelector(
  state => state.get('map'),
  region => region.toJS(),
);
