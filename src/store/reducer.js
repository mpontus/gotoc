import { combineReducers } from 'redux-immutable';
import createMapReducer from '../reducers/map';
import businesses from '../reducers/businesses';
import location from '../reducers/location';
import points from '../reducers/points';

const rootReducerFactory = config =>
  combineReducers({
    map: createMapReducer(config),
    businesses,
    location,
    points,
  });

export default rootReducerFactory;
