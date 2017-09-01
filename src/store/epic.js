import { combineEpics } from 'redux-observable';
import yelpEpic from '../epics/yelp';
import geolocationEpic from '../epics/geolocation';
import reviewsEpic from '../epics/reviews';

const rootEpic = combineEpics(yelpEpic, geolocationEpic, reviewsEpic);

export default rootEpic;
