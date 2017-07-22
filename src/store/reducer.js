import { combineReducers } from 'redux-immutable';
import map from '../reducers/map';
import businesses from '../reducers/businesses';

const rootReducer = combineReducers({
  map,
  businesses,
});

export default rootReducer;
