import { combineEpics } from 'redux-observable';
import yelpEpic from '../epics/yelp';

const rootEpic = combineEpics(yelpEpic);

export default rootEpic;
