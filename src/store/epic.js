import { combineEpics } from 'redux-observable';
// import yelpEpic from '../epics/yelp';
import geolocationEpic from '../epics/geolocation';
import mapEpic from '../epics/map';

const rootEpic = combineEpics(
  // yelpEpic,
  geolocationEpic,
  mapEpic,
);

export default rootEpic;
