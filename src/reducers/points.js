// @flow
import { Map, Set } from 'immutable';
import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { prop } from 'ramda';
import Quadtree from 'util/quadtree';
import cluster from 'util/clustering';
import type { Cluster } from 'util/clustering';
import { getBusinesses } from 'reducers/businesses';
import { BUSINESSES_ADDED } from 'actions/businesses';
import type { Action } from 'actions/types';
import type { Business } from 'types/Business';
import type { Region } from 'types/Region';

const initialState = Map({
  index: Set(),
  tree: Quadtree.create(-90, -180, 180, 360),
});

const indexReducer = handleActions(
  {
    [BUSINESSES_ADDED]: (state, action) =>
      state.withMutations(set => {
        const { businesses } = action.payload;

        return set.union(businesses.map(prop('id')));
      }),
  },
  initialState.get('index'),
);

const treeReducer = (state, action, context) => {
  switch (action.type) {
    case BUSINESSES_ADDED: {
      const index = context.get('index');
      // $FlowFixMe
      const { businesses } = action.payload;

      return (
        businesses
          // $FlowFixMe
          .filter(business => !index.has(business.id))
          .reduce((points, business) => {
            const { id } = business;
            const { latitude, longitude } = business.coordinates;

            // $FlowFixMe
            return points.insert(latitude, longitude, id);
          }, state)
      );
    }
    default:
      return state;
  }
};

const pointsReducer = (state: Map<*, *> = initialState, action: Action) => {
  const { index, tree } = state.toObject();

  return Map({
    index: indexReducer(index, action),
    tree: treeReducer(tree, action, state),
  });
};

const getPoints = state => state.getIn(['points', 'tree']);

const getRegionFromProps = (state, ownProps) => ownProps.region;

export const makeGetBusinessesInRegion = () =>
  createSelector(
    [getPoints, getBusinesses, getRegionFromProps],
    (points, businesses: Map<string, Business>, region: Region): Business[] => {
      const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

      return points
        .queryRange(
          latitude - latitudeDelta / 2,
          longitude - longitudeDelta / 2,
          latitudeDelta,
          longitudeDelta,
        )
        .map(id => businesses.get(id));
    },
  );

const businessToPoint = business => {
  const { latitude, longitude } = business.coordinates;

  return {
    ...business,
    x: longitude,
    y: latitude,
  };
};

export const makeGetClustersInRegion = () =>
  createSelector(
    [makeGetBusinessesInRegion(), getRegionFromProps],
    (businesses: Business[], region: Region): Cluster[] => {
      const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
      const dimensions = { cols: 3, rows: 3 };
      const bbox = {
        minX: longitude - longitudeDelta / 2,
        minY: latitude - latitudeDelta / 2,
        maxX: longitude + longitudeDelta / 2,
        maxY: latitude + latitudeDelta / 2,
      };

      return cluster(dimensions, bbox, businesses.map(businessToPoint));
    },
  );

export default pointsReducer;
