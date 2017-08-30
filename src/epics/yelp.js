// @flow
import type { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { curry } from 'ramda';
import type { Config } from 'types/Config';
import type { Business } from 'types/Business';
import { getRadiusForRegion } from 'util/geo';
import { REGION_CHANGE } from '../actions/map';
import { addBusinesses } from '../actions/businesses';
import type YelpApi from '../api/yelp';
import type { Action } from '../actions/types';

type Fetcher = (offset: number) => Promise<*>;
type CountGetter = (response: any) => number;

/**
 * Calls fetcher so long as it returns positive count.
 */
export const exhaustiveFetch = (
  fetcher: Fetcher,
  countGetter: CountGetter,
  offset: number = 0,
) =>
  Observable.defer(() => fetcher(offset))
    .mergeMap(response => {
      const count = countGetter(response);
      const nextOffset = offset + count;
      const next$ =
        count > 0
          ? exhaustiveFetch(fetcher, countGetter, nextOffset)
          : Observable.empty();

      return [Observable.of(response), next$];
    })
    .mergeAll();

/**
 * Creates fetcher compatible with `exhaustiveFetch`
 */
const yelpSearch = (api, latitude, longitude) => offset =>
  api.search({
    sort_by: 'distance',
    limit: 50,
    latitude,
    longitude,
    offset,
  });

const createBusinessesObservable = curry(
  (
    api: YelpApi,
    config: Config,
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  ) => {
    const radius = getRadiusForRegion(
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    );
    const fetcher = yelpSearch(api, latitude, longitude);
    const countGetter = response => response.businesses.length;
    const response$ = exhaustiveFetch(fetcher, countGetter)
      // Make at most 5 requests for every location change
      .take(config.maxConsecutiveRequests);
    const business$ = response$
      // $FlowFixMe
      .pluck('businesses')
      // Flatten the stream of responses into a stream of items
      .mergeAll()
      .takeWhile(({ distance }) => distance <= radius);

    return business$.bufferCount(config.businessesPerAction);
  },
);

const yelpEpic = (
  action$: ActionsObservable<Action>,
  store: any,
  { api, config }: { api: YelpApi, config: Config },
): Observable<Action> => {
  const getBusinessesForRegion = createBusinessesObservable(api, config);

  return action$
    .debounceTime(100)
    .ofType(REGION_CHANGE)
    .switchMap((action: Action): Observable<Business[]> => {
      // $FlowFixMe
      const { region } = action.payload;
      const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

      return getBusinessesForRegion(
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      );
    })
    .map(addBusinesses);
};

export default yelpEpic;
