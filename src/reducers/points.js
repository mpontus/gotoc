import { Map, Set } from 'immutable';
import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { prop } from 'ramda';
import Quadtree from 'util/quadtree';
import { getBusinesses } from 'reducers/businesses';
import { BUSINESSES_ADDED } from 'actions/businesses';

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
      const { businesses } = action.payload;

      return businesses
        .filter(business => !index.has(business.id))
        .reduce((points, business) => {
          const { id } = business;
          const { latitude, longitude } = business.coords;

          return points.insert(latitude, longitude, id);
        }, state);
    }
    default:
      return state;
  }
};

const pointsReducer = (state = initialState, action) => {
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
    (points, businesses, region) => {
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

export default pointsReducer;
