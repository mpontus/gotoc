// @flow
import type { Location } from 'types/Location';
import type { Action } from './types';

export const USER_LOCATION_UPDATED = 'USER_LOCATION_UPDATED';

export const updateUserLocation = (location: Location): Action => ({
  type: USER_LOCATION_UPDATED,
  payload: { location },
});
