import { fromJS } from 'immutable';
import { regionChange } from 'actions/map';
import reducer from '../map';

describe('reducer', () => {
  it('must return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(null);
  });

  it('must handle dragging the map', () => {
    const state = fromJS(null);
    const action = regionChange(33, 55, 0.01, 0.02);

    expect(reducer(state, action).toJS()).toEqual({
      latitude: 33,
      longitude: 55,
      latitudeDelta: 0.01,
      longitudeDelta: 0.02,
    });
  });
});
