import { fromJS } from 'immutable';
import { regionChange } from 'actions/map';
import makeReducer from '../map';

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

  it('must handle dragging the map', () => {
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
