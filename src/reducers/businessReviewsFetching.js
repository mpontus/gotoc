import { Set } from 'immutable';
import { createSelector } from 'reselect';
import { BUSINESS_DETAILS_VISITED } from 'actions/navigation';
import { BUSINESS_REVIEWS_RETRIEVED } from 'actions/businesses';

const initialState = Set();

export default function businessReviewsReducer(state = initialState, action) {
  switch (action.type) {
    case BUSINESS_DETAILS_VISITED: {
      const { business } = action.payload;

      return state.add(business.id);
    }
    case BUSINESS_REVIEWS_RETRIEVED: {
      const { business } = action.payload;

      return state.delete(business.id);
    }

    default:
      return state;
  }
}

export const makeGetBusinessReviewsFetching = () =>
  createSelector(
    [state => state.get('businessReviewsFetching'), (state, props) => props.id],
    (state, id) => state.has(id),
  );
