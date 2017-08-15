// @flow
import type { ActionsObservable } from 'redux-observable';
import { regionSettled, REGION_CHANGE } from 'actions/map';
import type { Action } from 'actions/types';

export default (action$: ActionsObservable<Action>): Observable<Action> =>
  action$
    .ofType(REGION_CHANGE)
    .debounceTime(500)
    .pluck('payload')
    .map(regionSettled);
