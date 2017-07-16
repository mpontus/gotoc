import { Map } from 'immutable';
import { pick } from 'ramda';
import { handleActions } from 'redux-actions';
import { REGION_CHANGE } from '../actions/map';

const initialState = null;

const mapReducer = handleActions(
  {
    [REGION_CHANGE]: (state, action) => {
      const { region } = action.payload;

      return Map(
        pick(
          ['latitude', 'longitude', 'latitudeDelta', 'longitudeDelta'],
          region,
        ),
      );
    },
  },
  initialState,
);

export default mapReducer;

export const getRegion = state => state.get('map');
