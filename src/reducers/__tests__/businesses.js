import { Map, OrderedSet } from 'immutable';
import { regionChange } from 'actions/map';
import { addBusinesses } from 'actions/businesses';
import reducer from '../businesses';

describe('reducer', () => {
  it('should handle CHANGE_REGION', () => {
    const initialState = Map({
      fetching: false,
      ids: OrderedSet(['1', '2']),
    });
    const region = {
      latitude: 33.756,
      longitude: -111.2715,
      latitudeDelta: 0.0321,
      longitudeDelta: 0.0261,
    };
    const action = regionChange(region);

    const result = reducer(initialState, action);

    expect(result.toJS()).toEqual({
      fetching: true,
      ids: [],
    });
  });

  it('should handle BUSINESSES_ADDED', () => {
    const initialState = Map({
      fetching: true,
      ids: OrderedSet(['1', '2']),
    });
    const businesses = [{ id: '2' }, { id: '3' }, { id: '4' }];
    const action = addBusinesses(businesses);
    const result = reducer(initialState, action);

    expect(result.toJS()).toEqual({
      fetching: true,
      ids: ['1', '2', '3', '4'],
    });
  });

  it('should handle BUSINESSES_ADDED#complete', () => {
    const initialState = Map({
      fetching: true,
      ids: OrderedSet(['1', '2']),
    });
    const businesses = [{ id: '2' }, { id: '3' }, { id: '4' }];
    const action = addBusinesses(businesses, true);
    const result = reducer(initialState, action);

    expect(result.toJS()).toEqual({
      fetching: false,
      ids: ['1', '2', '3', '4'],
    });
  });
});
