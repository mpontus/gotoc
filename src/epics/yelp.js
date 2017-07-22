// @flow
import type { Coordinates } from 'geolib';
import type { Observable } from 'rxjs';
import { getDistance } from 'geolib';
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

function getRegionRadius(
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
) {
  const topLeft: Coordinates = {
    latitude: latitude - latitudeDelta,
    longitude: longitude - longitudeDelta,
  };
  const bottomRight: Coordinates = {
    latitude: latitude + latitudeDelta,
    longitude: longitude + longitudeDelta,
  };

  return getDistance(topLeft, bottomRight);
}

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
      const radius = getRegionRadius(
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
