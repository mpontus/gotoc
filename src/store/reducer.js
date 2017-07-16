import { combineReducers } from 'redux-immutable';
import map from '../reducers/map';

const rootReducer = combineReducers({
  map,
});

export default rootReducer;
