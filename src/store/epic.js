import { combineEpics } from 'redux-observable';
import yelpEpic from '../epics/yelp';
import geolocationEpic from '../epics/geolocation';

const rootEpic = combineEpics(yelpEpic, geolocationEpic);

export default rootEpic;
