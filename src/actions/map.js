// @flow
import { createAction } from 'redux-actions';

export const REGION_CHANGE: string = 'REGION_CHANGE';

export const regionChange = createAction(
  REGION_CHANGE,
  (
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  ) => ({
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  }),
);
