import { Map, OrderedSet } from 'immutable';
import { createSelector } from 'reselect';
import { REGION_CHANGE } from 'actions/map';
import { BUSINESSES_ADDED } from 'actions/businesses';
import { getBusinesses } from 'reducers/entities';

const initialState = Map({
  fetching: true,
  ids: OrderedSet(),
});

const businessesReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGION_CHANGE: {
      return state.withMutations(map =>
        map.set('fetching', true).set('ids', OrderedSet()),
      );
    }
    case BUSINESSES_ADDED: {
      const { result, complete } = action.payload;

      return state.withMutations(map => {
        map.update('ids', list => list.concat(result));

        map.set('fetching', !complete);
      });
    }

    default:
      return state;
  }
};

export default businessesReducer;

const getBusinessIds = state => state.getIn(['businesses', 'ids']);

export const getBusinessesFetching = state =>
  state.getIn(['businesses', 'fetching']);

export const makeGetBusinesses = () =>
  createSelector([getBusinesses, getBusinessIds], (businesses, ids) =>
    ids.map(id => businesses.get(id)).toJS(),
  );
