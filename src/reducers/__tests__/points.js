import { Map, Set } from 'immutable';
import Quadtree from 'util/quadtree';
import { addBusinesses } from 'actions/businesses';
import pointsReducer from '../points';

describe('pointsReducer', () => {
  it('returns the initial state', () => {
    const newState = pointsReducer(undefined, { type: 'foo' });

    expect(newState.toObject()).toEqual({
      index: expect.any(Set),
      tree: expect.any(Quadtree),
    });
  });

  it('adds businesses to the index', () => {
    const action = addBusinesses([
      { id: 'foo', coordinates: { latitude: 15, longitude: 15 } },
      { id: 'bar', coordinates: { latitude: 17, longitude: 17 } },
    ]);
    const newState = pointsReducer(undefined, action);

    expect(newState.get('index').toArray()).toEqual(['foo', 'bar']);
  });

  it('adds businesses to quadtree', () => {
    const action = addBusinesses([
      { id: 'foo', coordinates: { latitude: 15, longitude: 15 } },
      { id: 'bar', coordinates: { latitude: 17, longitude: 17 } },
    ]);
    const newState = pointsReducer(undefined, action);

    expect(newState.get('tree').queryRange(10, 10, 10, 10)).toEqual([
      'foo',
      'bar',
    ]);
  });

  it('must not add businesses which already exist in the index', () => {
    const state = Map({
      index: Set(['foo']),
      tree: Quadtree.create(0, 0, 10, 10),
    });
    const action = addBusinesses([
      { id: 'foo', coordinates: { latitude: 2, longitude: 2 } },
      { id: 'bar', coordinates: { latitude: 3, longitude: 3 } },
    ]);
    const newState = pointsReducer(state, action);

    expect(newState.get('tree').queryRange(0, 0, 10, 10)).toEqual(['bar']);
  });
});
