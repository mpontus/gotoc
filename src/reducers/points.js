// @flow
import { Map, Set } from 'immutable';
import { handleActions } from 'redux-actions';
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
        const { result } = action.payload;

        return set.union(result);
      }),
  },
  initialState.get('index'),
);

const treeReducer = (state, action, context) => {
  switch (action.type) {
    case BUSINESSES_ADDED: {
      const index = context.get('index');
      // $FlowFixMe
      const { result, entities } = action.payload;
      const { businesses } = entities;

      return (
        result
          // $FlowFixMe
          .filter(id => !index.has(id))
          .reduce((points, id) => {
            const business = businesses[id];
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
