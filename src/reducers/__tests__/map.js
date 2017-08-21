import { fromJS } from 'immutable';
import { regionChange } from 'actions/map';
import Quadtree from 'util/quadtree';
import makeReducer, { makeGetClusters } from '../map';

const config = {
  defaultLatitude: 0,
  defaultLongitude: 0,
  defaultRadius: 1000,
};

describe('reducer', () => {
  it('must return the initial state', () => {
    const reducer = makeReducer(config);

    expect(reducer(undefined, {}).toJS()).toMatchObject({
      default: true,
      latitude: 0,
      longitude: 0,
      latitudeDelta: expect.any(Number),
      longitudeDelta: expect.any(Number),
    });
  });

  it('must map movement', () => {
    const reducer = makeReducer(config);
    const state = fromJS(null);
    const action = regionChange(33, 55, 0.01, 0.02);

    expect(reducer(state, action).toJS()).toEqual({
      default: false,
      latitude: 33,
      longitude: 55,
      latitudeDelta: 0.01,
      longitudeDelta: 0.02,
    });
  });
});

describe('makeGetClusters', () => {
  it.only('must return clusters near the current region', () => {
    const getClusters = makeGetClusters();

    const state = fromJS({
      businesses: {
        1: {
          id: '1',
          coordinates: {
            latitude: 13,
            longitude: 18,
          },
        },
        2: {
          id: '2',
          coordinates: {
            latitude: 65,
            longitude: 84,
          },
        },
        3: {
          id: '3',
          coordinates: {
            latitude: 15,
            longitude: 14,
          },
        },
      },
      points: {
        tree: Quadtree.create(0, 0, 100, 100)
          .insert(13, 18, '1')
          .insert(65, 84, '2')
          .insert(15, 14, '3'),
      },
      map: {
        region: {
          latitude: 15,
          longitude: 15,
          latitudeDelta: 16,
          longitudeDelta: 16,
        },
        layout: {
          width: 640,
          height: 480,
        },
      },
    });

    const result = getClusters(state);

    expect(result).toEqual([
      {
        type: 'Feature',
        properties: {
          id: '1',
          coordinates: {
            latitude: 13,
            longitude: 18,
          },
        },
        geometry: {
          type: 'Point',
          coordinates: [18, 13],
        },
      },
      {
        type: 'Feature',
        properties: {
          id: '3',
          coordinates: {
            latitude: 15,
            longitude: 14,
          },
        },
        geometry: {
          type: 'Point',
          coordinates: [14, 15],
        },
      },
    ]);
  });
});
