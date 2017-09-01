// @flow
import { Map, fromJS } from 'immutable';
import { createSelector } from 'reselect';
import type { Business } from 'types/Business';
import { BUSINESSES_ADDED } from 'actions/businesses';
import type { Action } from 'actions/types';
import type { State } from './types';

const initialState = fromJS({
  businesses: {},
});

export default function businessesReducer(
  state: Map<string, Business> = initialState,
  action: Action,
) {
  switch (action.type) {
    case BUSINESSES_ADDED: {
      // $FlowFixMe
      const { businesses } = action.payload.entities;

      return state.mergeIn(['businesses'], fromJS(businesses));
    }

    default:
      return state;
  }
}

export const getBusinesses = (state: State): Map<string, Map<string, any>> =>
  state.getIn(['entities', 'businesses'], Map());

const getIdProp = (state, ownProps) => ownProps.id;

export const makeGetBusiness = () =>
  createSelector([getBusinesses, getIdProp], (businesses, id) => {
    const business = businesses.get(id);

    if (!business) {
      return null;
    }

    return business.toJS();
  });
