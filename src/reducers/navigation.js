import { Map } from 'immutable';
import { BUSINESS_DETAILS_REQUESTED } from 'actions/listing';

const initialState = Map({
  selectedBusinessId: null,
});

const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case BUSINESS_DETAILS_REQUESTED: {
      const { business } = action.payload;

      return state.set('selectedBusinessId', business.id);
    }

    default:
      return state;
  }
};

export default navigationReducer;
