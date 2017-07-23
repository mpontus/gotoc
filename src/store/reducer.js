import { combineReducers } from 'redux-immutable';
import createMapReducer from '../reducers/map';
import businesses from '../reducers/businesses';
import location from '../reducers/location';

const rootReducerFactory = config =>
  combineReducers({
    map: createMapReducer(config),
    businesses,
    location,
  });

export default rootReducerFactory;
