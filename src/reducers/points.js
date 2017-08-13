// @flow
import { Map, Set } from 'immutable';
import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { prop } from 'ramda';
import Quadtree from 'util/quadtree';
import clusterPoints from 'util/clustering';
import { getBusinesses } from 'reducers/businesses';
import { BUSINESSES_ADDED } from 'actions/businesses';
import { getRegionBoundaries } from 'util/map';
import type { Action } from 'actions/types';
import type { Business } from 'types/Business';
import type { Region } from 'types/Region';
import type { Cluster } from 'types/Cluster';

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
      const { latitudeDelta, longitudeDelta } = region;
      const boundaries = getRegionBoundaries(region);

      return points
        .queryRange(boundaries[2], boundaries[1], latitudeDelta, longitudeDelta)
        .map(id => businesses.get(id));
    },
  );

const businessToPoint = business => {
  const { latitude, longitude } = business.coordinates;

  return {
    business,
    x: longitude,
    y: latitude,
  };
};

export const makeGetClustersInRegion = () =>
  createSelector(
    [makeGetBusinessesInRegion(), getRegionFromProps],
    (businesses: Business[], region: Region): Cluster[] => {
      const dimensions = { cols: 4, rows: 4 };
      const [maxX, minY, minX, maxY] = getRegionBoundaries(region);
      const bbox = { minX, minY, maxX, maxY };

      return clusterPoints(
        dimensions,
        bbox,
        businesses.map(businessToPoint),
      ).map(cluster => {
        const points = cluster.points.map(
          point =>
            // $FlowFixMe
            point.business,
        );

        return {
          latitude: cluster.y,
          longitude: cluster.x,
          points,
        };
      });
    },
  );

export default pointsReducer;
