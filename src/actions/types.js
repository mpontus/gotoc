// @flow
import type { Business } from '../api/yelp';
import { REGION_CHANGE } from './map';
import { BUSINESSES_ADDED } from './businesses';

export type Action =
  | {
      type: typeof REGION_CHANGE,
      payload: {
        latitude: number,
        longitude: number,
        latitudeDelta: number,
        longitudeDelta: number,
      },
    }
  | {
      type: typeof BUSINESSES_ADDED,
      payload: {
        businesses: Business[],
      },
    };
