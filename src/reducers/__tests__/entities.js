import { fromJS } from 'immutable';
import { addBusinesses } from 'actions/businesses';
import reducer from '../entities';

describe('reducer', () => {
  it('handles BUSINESSES_ADDED', () => {
    const initialState = fromJS({
      businesses: {
        lisp: {
          id: 'lisp',
          name: 'Lisp',
        },
      },
    });
    const action = addBusinesses([
      {
        id: 'haskell',
        name: 'Haskell',
      },
      {
        id: 'prolog',
        name: 'Prolog',
      },
    ]);

    const state = reducer(initialState, action);

    expect(state.toJS()).toEqual({
      businesses: {
        lisp: {
          id: 'lisp',
          name: 'Lisp',
        },
        haskell: {
          id: 'haskell',
          name: 'Haskell',
        },
        prolog: {
          id: 'prolog',
          name: 'Prolog',
        },
      },
    });
  });
});
