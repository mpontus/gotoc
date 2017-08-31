// @flow
import type { Business } from 'types/Business';
import type { Location } from 'types/Location';
import type { Region } from 'types/Region';
import type { Review } from 'types/Review';
import { REGION_CHANGE } from './map';
import { BUSINESSES_ADDED } from './businesses';
import { USER_LOCATION_UPDATED } from './location';
import { BUSINESS_DETAILS_VISITED } from './navigation';

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
      type: typeof BUSINESS_DETAILS_VISITED,
      payload: {|
        business: Business,
        reviews: ?(Review[]),
      |},
    |};
