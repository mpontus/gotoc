// @flow
import type { Business } from '../api/yelp';
import type { Action } from './types';

export const BUSINESSES_ADDED = 'BUSINESSES_ADDED';

export function addBusinesses(businesses: Business[]): Action {
  return {
    type: BUSINESSES_ADDED,
    payload: {
      businesses,
    },
  };
}
