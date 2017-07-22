import { combineReducers } from 'redux-immutable';
import map from '../reducers/map';
import businesses from '../reducers/businesses';
import location from '../reducers/location';

const rootReducer = combineReducers({
  map,
  businesses,
  location,
});

export default rootReducer;
