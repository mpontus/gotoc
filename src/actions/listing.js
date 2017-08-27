// @flow
import type { Business } from 'types/Business';
import type { Action } from './types';

export const BUSINESS_DETAILS_REQUESTED = 'BUSINESS_DETAILS_REQUESTED';

export const requestBusinessDetails = (business: Business): Action => ({
  type: BUSINESS_DETAILS_REQUESTED,
  payload: business,
});
