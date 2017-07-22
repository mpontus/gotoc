// @flow
import type { Business } from 'types/Business';
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
