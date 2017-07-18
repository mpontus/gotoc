const rootEpic = (action$, store, { api }) =>
  action$
    .ofType('foo')
    .mergeMap(() =>
      api.get('https://api.yelp.com/v3/businesses/search?location=Moscow'),
    )
    .map(response => ({
      type: 'bar',
      payload: response,
    }));

export default rootEpic;
