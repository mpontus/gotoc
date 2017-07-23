// @flow
import type { Observable } from 'rxjs';
import { getRadiusForRegion } from 'util/geolib';
import { REGION_CHANGE } from '../actions/map';
import { addBusinesses } from '../actions/businesses';
import type YelpApi from '../api/yelp';
import type { Action } from '../actions/types';

type Region = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
};

const yelpEpic = (
  action$: Observable<Action>,
  store: any,
  { api }: { api: YelpApi },
): Observable<Action> =>
  action$
    .filter((action: Action) => action.type === REGION_CHANGE)
    // $FlowFixMe
    .pluck('payload', 'region')
    .mergeMap(async (region: Region) => {
      const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
      const radius = getRadiusForRegion(
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      );
      const { businesses } = await api.search({
        longitude,
        latitude,
        radius: Math.min(radius, 40000),
      });

      return addBusinesses(businesses);
    });

export default yelpEpic;
