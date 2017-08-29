import { fromJS } from 'immutable';
import { requestBusinessDetails } from 'actions/listing';
import reducer from '../navigation';

describe('Navigation reducer', () => {
  it('returns initial state', () => {
    const state = reducer(undefined, {});

    expect(state.toJS()).toEqual({
      selectedBusinessId: null,
    });
  });

  it('handles BUSINESS_DETAILS_REQUESTED', () => {
    const initialState = fromJS({
      selectedBusinessId: 'erlang',
    });
    const action = requestBusinessDetails({ id: 'elixir' });
    const state = reducer(initialState, action);

    expect(state.toJS()).toEqual({
      selectedBusinessId: 'elixir',
    });
  });
});
