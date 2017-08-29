import { fromJS } from 'immutable';
import { updateUserLocation } from 'actions/location';
import reducer from '../location';

describe('location reducer', () => {
  it('handles USER_LOCATION_UPDATED', () => {
    const initialState = fromJS({
      acquired: false,
      latitude: null,
      longitude: null,
    });
    const action = updateUserLocation({
      latitude: 33,
      longitude: 57,
    });
    const state = reducer(initialState, action);

    expect(state.toJS()).toEqual({
      acquired: true,
      latitude: 33,
      longitude: 57,
    });
  });
});
