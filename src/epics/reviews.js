import { BUSINESS_DETAILS_VISITED } from 'actions/navigation';
import { addBusinessReviews } from 'actions/businesses';

const reviewsEpic = (action$, store, { api }) =>
  action$.ofType(BUSINESS_DETAILS_VISITED).mergeMap(action => {
    const { business } = action.payload;

    return api
      .fetchReviews(business.id)
      .then(response => response.reviews)
      .then(items => addBusinessReviews(business, items));
  });

export default reviewsEpic;
