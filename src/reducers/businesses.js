// @flow
import { fromJS, List } from 'immutable';
import type { Business } from 'types/Business';
import { BUSINESSES_ADDED } from 'actions/businesses';
import { REGION_CHANGE } from 'actions/map';
import type { Action } from 'actions/types';
import type { State } from './types';

export default function businessesReducer(
  state: List<Map<*, *>> = List(),
  action: Action,
) {
  switch (action.type) {
    case REGION_CHANGE: {
      // $FlowFixMe
      const { region } = action.payload;

      return state.filter(business => {
        // $FlowFixMe
        const { latitude, longitude } = business.get('coordinates').toJS();
        const { latitudeDelta, longitudeDelta } = region;

        return (
          Math.abs(region.latitude - latitude) < latitudeDelta / 2 &&
          Math.abs(region.longitude - longitude) < longitudeDelta / 2
        );
      });
    }
    case BUSINESSES_ADDED:
      // $FlowFixMe
      return fromJS(action.payload.businesses);

    default:
      return state;
  }
}

export const getBusinesses = (state: State): List<Business> =>
  state.get('businesses');
