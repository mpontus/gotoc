import { ajax } from 'rxjs/observable/dom/ajax';

const API_URL = 'http://demo1559818.mockable.io/test';

const rootEpic = action$ =>
  action$.ofType('foo').mergeMap(() =>
    ajax.getJSON(API_URL).map(response => ({
      type: 'bar',
      payload: response,
    })),
  );

export default rootEpic;
