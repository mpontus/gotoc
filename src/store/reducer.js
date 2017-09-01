import { combineReducers } from 'redux-immutable';
import createMapReducer from 'reducers/map';
import entities from 'reducers/entities';
import businesses from 'reducers/businesses';
import location from 'reducers/location';
import points from 'reducers/points';
import businessReviews from 'reducers/businessReviews';
import businessReviewsFetching from 'reducers/businessReviewsFetching';

const rootReducerFactory = config =>
  combineReducers({
    map: createMapReducer(config),
    entities,
    location,
    points,
    businesses,
    businessReviews,
    businessReviewsFetching,
  });

export default rootReducerFactory;
