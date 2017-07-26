// @flow
import { Map } from 'immutable';
import type { Business } from 'types/Business';
import { BUSINESSES_ADDED } from 'actions/businesses';
import type { Action } from 'actions/types';
import type { State } from './types';

export default function businessesReducer(
  state: Map<string, Business>,
  action: Action,
) {
  switch (action.type) {
    case BUSINESSES_ADDED: {
      // $FlowFixMe
      const { businesses } = action.payload;

      return state.withMutations(map => {
        businesses.forEach(business => {
          const { id } = business;

          map.set(id, business);
        });
      });
    }

    default:
      return state;
  }
}

export const getBusinesses = (state: State): Map<string, Business> =>
  state.get('businesses');
