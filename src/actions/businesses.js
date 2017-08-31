// @flow
import type { Business } from 'types/Business';
import type { Review } from 'types/Review';
import type { Action } from './types';

export const BUSINESSES_ADDED = 'BUSINESSES_ADDED';
export const BUSINESS_REVIEWS_RETRIEVED = 'BUSINESS_REVIEWS_RETRIEVED';

export function addBusinesses(businesses: Business[]): Action {
  return {
    type: BUSINESSES_ADDED,
    payload: {
      businesses,
    },
  };
}

export function addBusinessReviews(
  business: Business,
  reviews: Review[],
): Action {
  return {
    type: BUSINESS_REVIEWS_RETRIEVED,
    payload: {
      business,
      reviews,
    },
  };
}
