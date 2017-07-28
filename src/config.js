// @flow
import type { Config } from 'types/Config';

const config: Config = {
  defaultLatitude: 37.78825,
  defaultLongitude: -122.4324,
  // defaultLatitude: 55.7494733,
  // defaultLongitude: 37.3523254,
  defaultRadius: 1000,
  maxConsecutiveRequests: 5,
  businessesPerAction: 10,
};

export default config;
