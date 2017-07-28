import { Map, Set } from 'immutable';
import Quadtree from 'util/quadtree';
import { addBusinesses } from 'actions/businesses';
import pointsReducer, {
  makeGetBusinessesInRegion,
  makeGetClustersInRegion,
} from '../points';

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

describe('makeGetBusinessesInRegion', () => {
  it('should return businesse in region', () => {
    const state = Map({
      businesses: Map({
        1: 'foo',
        2: 'bar',
        3: 'baz',
      }),
      points: Map({
        tree: Quadtree.create(0, 0, 100, 100)
          .insert(20, 20, '1')
          .insert(30, 30, '2')
          .insert(40, 40, '3'),
      }),
    });

    const getBusinessesInRegion = makeGetBusinessesInRegion();
    const region = {
      latitude: 25,
      longitude: 25,
      latitudeDelta: 12,
      longitudeDelta: 12,
    };
    const businesses = getBusinessesInRegion(state, { region });

    expect(businesses).toEqual(['foo', 'bar']);
  });
});

describe('makeGetClustersInRegion', () => {
  it('should return clusters in the region', () => {
    const state = Map({
      businesses: Map({
        1: { id: 'foo', coordinates: { latitude: 12, longitude: 12 } },
        2: { id: 'bar', coordinates: { latitude: 14, longitude: 14 } },
        3: { id: 'baz', coordinates: { latitude: 90, longitude: 90 } },
      }),
      points: Map({
        tree: Quadtree.create(0, 0, 100, 100)
          .insert(12, 12, '1')
          .insert(14, 14, '2')
          .insert(90, 90, '3'),
      }),
    });

    const region = {
      latitude: 50,
      longitude: 50,
      latitudeDelta: 100,
      longitudeDelta: 100,
    };
    const result = makeGetClustersInRegion()(state, { region });

    expect(result).toEqual([
      {
        x: 13,
        y: 13,
        points: [
          {
            x: 12,
            y: 12,
            coordinates: {
              latitude: 12,
              longitude: 12,
            },
            id: 'foo',
          },
          {
            x: 14,
            y: 14,
            coordinates: {
              latitude: 14,
              longitude: 14,
            },
            id: 'bar',
          },
        ],
      },
      {
        x: 90,
        y: 90,
        points: [
          {
            x: 90,
            y: 90,
            coordinates: {
              latitude: 90,
              longitude: 90,
            },
            id: 'baz',
          },
        ],
      },
    ]);
  });
});
