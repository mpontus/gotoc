// @flow
import { Map } from 'immutable';
import R from 'ramda';
import { handleActions } from 'redux-actions';
import { createSelector, defaultMemoize as memoize } from 'reselect';
import shallowEqualObjects from 'shallow-equal/objects';
import supercluster from 'supercluster';
import type { Config } from 'types/Config';
import { getDeltasForRadius } from 'util/geo';
import { getZoomLevel as calculateZoomLevel } from 'util/map';
import generalizeRegion from 'util/generalizeRegion';
import { getPoints } from 'reducers/points';
import { getBusinesses } from 'reducers/businesses';
import { REGION_CHANGE, LAYOUT_CHANGE } from 'actions/map';
import type { Business } from 'types/Business';

const defaultState = Map({
  moved: false,
  region: Map({
    latitude: null,
    longitude: null,
    latitudeDelta: null,
    longitudeDelta: null,
  }),
  layout: Map({
    width: null,
    height: null,
  }),
});

function getInitialState(config: Config) {
  const { defaultLatitude, defaultLongitude, defaultRadius } = config;
  const {
    latitude: latitudeDelta,
    longitude: longitudeDelta,
  } = getDeltasForRadius(defaultLatitude, defaultLongitude, defaultRadius);

  return defaultState.set(
    'region',
    Map({
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      latitudeDelta,
      longitudeDelta,
    }),
  );
}

const makeMapReducer = (config: Config) =>
  handleActions(
    {
      [REGION_CHANGE]: (state, action) => {
        const region = action.payload;

        return state.set('moved', true).mergeIn(['region'], region);
      },
      [LAYOUT_CHANGE]: (state, action) => {
        const layout = action.payload;

        return state.mergeIn(['layout'], layout);
      },
    },
    getInitialState(config),
  );

export default makeMapReducer;

const businessToGeoPoint = R.applySpec({
  type: R.always('Feature'),
  properties: R.identity,
  geometry: {
    type: R.always('Point'),
    coordinates: R.juxt([
      R.path(['coordinates', 'longitude']),
      R.path(['coordinates', 'latitude']),
    ]),
  },
});

export const getRegion = createSelector(
  state => state.getIn(['map', 'region']),
  region => region.toJS(),
);

export const getLayout = createSelector(
  state => state.getIn(['map', 'layout']),
  layout => layout.toJS(),
);

export const getZoomLevel = createSelector(
  [getRegion, getLayout],
  (region, layout) => calculateZoomLevel(region.latitudeDelta, layout.width),
);

export const makeGetBoundaries = () =>
  createSelector(
    [getRegion, getLayout],
    R.pipe(
      (region, layout): ?Object => {
        if (!region || !layout) return null;

        return generalizeRegion(region, layout);
      },
      // Ensure that equivalent objects are equal by reference
      memoize(R.identity, shallowEqualObjects),
    ),
  );

const makeGetPoints = () =>
  createSelector([makeGetBoundaries(), getPoints], (boundaries, points) => {
    if (!boundaries) return [];

    const { westLng, southLat, eastLng, northLat } = boundaries;
    const width = eastLng - westLng;
    const height = northLat - southLat;

    return points.queryRange(westLng, southLat, width, height);
  });

const makeGetBusinesses = () =>
  createSelector(
    [makeGetPoints(), getBusinesses],
    (points, businesses): Business[] =>
      points.map(id => businesses.get(id).toJS()),
  );

export const makeGetClusters = () =>
  createSelector(
    [makeGetBusinesses(), makeGetBoundaries(), getZoomLevel],
    (businesses, boundaries, zoom) => {
      if (!boundaries) return [];

      const { westLng, southLat, eastLng, northLat } = boundaries;
      const index = supercluster({ minZoom: zoom, maxZoom: zoom });

      // $FlowFixMe
      index.load(R.map(businessToGeoPoint, businesses));

      return index.getClusters([westLng, southLat, eastLng, northLat], zoom);
    },
  );
