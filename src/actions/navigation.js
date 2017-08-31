// @flow
import type { Business } from 'types/Business';
import type { Review } from 'types/Review';
import type { Action } from './types';

export const BUSINESS_DETAILS_VISITED = 'BUSINESS_DETAILS_VISITED';

export const visitBusinessDetails = (
  business: Business,
  reviews: ?(Review[]),
) => ({
  type: BUSINESS_DETAILS_VISITED,
  payload: {
    business,
    reviews,
  },
});

export const shouldFetchReviews = (action: Action): boolean =>
  action.type === BUSINESS_DETAILS_VISITED &&
  // $FlowFixMe
  !action.payload.reviews;
