// @flow
import { Map } from 'immutable';
import { createSelector } from 'reselect';
import type { Action } from 'actions/types';
import { USER_LOCATION_UPDATED } from 'actions/location';

type Location = Map<*, *>;

const initialState = Map({
  acquired: false,
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
      const { latitude, longitude } = action.payload.location;

      return Map({
        acquired: true,
        latitude,
        longitude,
      });
    }

    default:
      return state;
  }
}

export const getLocation = createSelector(
  state => state.get('location'),
  location => location.toJS(),
);

export default locationReducer;
