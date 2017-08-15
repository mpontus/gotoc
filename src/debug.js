import { addBusinesses } from 'actions/businesses';
import businessesFixture from '../fixtures/businesses.json';

export default function(store) {
  store.dispatch(addBusinesses(businessesFixture));
}
