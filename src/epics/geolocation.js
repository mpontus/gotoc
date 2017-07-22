// @flow
import Rx from 'rxjs';
import type { Location } from 'types/Location';
import type { Action } from 'actions/types';
import { updateUserLocation } from 'actions/location';

const GEOLOCATION_TIMEOUT = 20000;
const GEOLOCATION_MAXIMUM_AGE = 24 * 3600 * 1000;

const geolocationSource: Observable<Location,> = Rx.Observable.create(observer => {
  navigator.geolocation.watchPosition(
    location => observer.next.bind(observer)(location),
    observer.error.bind(observer),
    {
      enableHighAccuracy: true,
      timeout: GEOLOCATION_TIMEOUT,
      maximumAge: GEOLOCATION_MAXIMUM_AGE,
    },
  );
});

const geolocationEpic = (): Observable<Action> =>
  geolocationSource.map(updateUserLocation);

export default geolocationEpic;
