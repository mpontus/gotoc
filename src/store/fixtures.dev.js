import { addBusinesses } from 'actions/businesses';
import businessesFixture from '../../fixtures/businesses.json';
import createReducer from './reducer';

export default function loadFixtures(config) {
  const reducer = createReducer(config);

  return reducer(undefined, addBusinesses(businessesFixture));
}
