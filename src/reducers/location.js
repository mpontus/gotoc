// @flow
import { Map } from 'immutable';
import type { Action } from 'actions/types';
import { USER_LOCATION_UPDATED } from 'actions/location';

type Location = Map<*, *>;

const initialState = Map({
  acquired: false,
  timestamp: null,
  latitude: null,
  longitude: null,
});

function locationReducer(
  state: Location = initialState,
  action: Action,
): Location {
  switch (action.type) {
    case USER_LOCATION_UPDATED: {
      // $FlowFixMe
      const { timestamp, coords } = action.payload;
      // $FlowFixMe
      const { latitude, longitude } = coords;

      return Map({
        acquired: true,
        timestamp,
        latitude,
        longitude,
      });
    }

    default:
      return state;
  }
}

export const getLocation = (state: Map<*, *>): Location =>
  state.get('location');

export default locationReducer;
