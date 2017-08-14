#!/usr/bin/env node

// eslint-disable-next-line import/no-extraneous-dependencies
import 'isomorphic-fetch';
import Api from '../../src/api/yelp';
import { exhaustiveFetch } from '../../src/epics/yelp';

if (process.argv.length < 5) {
  process.stdout.write(
    'Usage: fetch-businesses.js [latitude] [longitude] [limit]\n',
  );

  process.exit(1);
}

const [latitude, longitude, limit] = process.argv.slice(2);
const { YELP_CLIENT_ID, YELP_CLIENT_SECRET } = process.env;
const api = new Api(YELP_CLIENT_ID, YELP_CLIENT_SECRET);

exhaustiveFetch(
  offset =>
    api.search({
      sort_by: 'distance',
      limit: 50,
      latitude,
      longitude,
      offset,
    }),
  response => response.businesses.length,
)
  .pluck('businesses')
  .mergeAll()
  .take(limit)
  .toArray()
  .toPromise()
  .then(businesses => {
    process.stdout.write(JSON.stringify(businesses, null, 2));
  })
  .catch(error => {
    process.stdout.write(error.message);

    process.exit(1);
  });
