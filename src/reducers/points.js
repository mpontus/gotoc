// @flow
import { Map, Set } from 'immutable';
import { handleActions } from 'redux-actions';
import { prop } from 'ramda';
import Quadtree from 'util/quadtree';
import { BUSINESSES_ADDED } from 'actions/businesses';
import type { Action } from 'actions/types';

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

export default pointsReducer;

export const getPoints = (state: Map<*, *>): Quadtree =>
  state.get('points').get('tree');
