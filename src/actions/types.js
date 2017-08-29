// @flow
import type { Business } from 'types/Business';
import type { Location } from 'types/Location';
import type { Region } from 'types/Region';
import { REGION_CHANGE } from './map';
import { BUSINESSES_ADDED } from './businesses';
import { USER_LOCATION_UPDATED } from './location';
import { BUSINESS_DETAILS_REQUESTED } from './listing';

export type Action =
  | {|
      type: typeof REGION_CHANGE,
      payload: { region: Region },
    |}
  | {|
      type: typeof BUSINESSES_ADDED,
      payload: {
        businesses: Business[],
      },
    |}
  | {|
      type: typeof USER_LOCATION_UPDATED,
      payload: { location: Location },
    |}
  | {|
      type: typeof BUSINESS_DETAILS_REQUESTED,
      payload: { business: Business },
    |};
