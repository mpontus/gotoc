// @flow
import { fromJS, List } from 'immutable';
import type { Business } from 'types/Business';
import { BUSINESSES_ADDED } from 'actions/businesses';
import type { Action } from 'actions/types';
import type { State } from './types';

export default function businessesReducer(
  state: List<Business> = List(),
  action: Action,
) {
  switch (action.type) {
    case BUSINESSES_ADDED:
      // $FlowFixMe
      return fromJS(action.payload.businesses);

    default:
      return state;
  }
}

export const getBusinesses = (state: State): List<Business> =>
  state.get('businesses');
