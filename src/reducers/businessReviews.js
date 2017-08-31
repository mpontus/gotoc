import { Map, fromJS } from 'immutable';
import { createSelector } from 'reselect';
import { BUSINESS_REVIEWS_RETRIEVED } from 'actions/businesses';

const initialState = Map();

export default function businessReviewsReducer(state = initialState, action) {
  switch (action.type) {
    case BUSINESS_REVIEWS_RETRIEVED: {
      const { business, reviews } = action.payload;

      return state.set(business.id, fromJS(reviews));
    }

    default:
      return state;
  }
}

const getReviewsForAllBusinesses = state => state.get('businessReviews');

export const makeGetBusinessReviews = () =>
  createSelector(
    [getReviewsForAllBusinesses, (state, props) => props.id],
    (allBusinessReviews, businessId) => allBusinessReviews.get(businessId),
  );
