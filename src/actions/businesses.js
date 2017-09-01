// @flow
import { normalize, schema } from 'normalizr';
import type { Business } from 'types/Business';
import type { Review } from 'types/Review';
import type { Action } from './types';

export const BUSINESSES_ADDED = 'BUSINESSES_ADDED';
export const BUSINESS_REVIEWS_RETRIEVED = 'BUSINESS_REVIEWS_RETRIEVED';

const businessSchema = new schema.Entity('businesses');

export function addBusinesses(
  businesses: Business[],
  complete: boolean = false,
): Action {
  const { result, entities } = normalize(businesses, [businessSchema]);

  return {
    type: BUSINESSES_ADDED,
    payload: {
      result,
      entities,
      complete,
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
