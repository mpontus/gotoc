import { Observable } from 'rxjs';
import R from 'ramda';
import { regionChange } from 'actions/map';
import { getRadiusForRegion } from 'util/geolib';
import epic, { exhaustiveFetch } from '../yelp';

jest.mock('util/geolib');

const makeResponse = R.compose(
  Promise.resolve,
  R.mergeDeepRight({
    businesses: [],
    total: 1000,
  }),
);

const defaultConfig = {
  maxConsecutiveRequests: 9999,
};

describe('Yelp Epic', () => {
  beforeEach(() => {
    getRadiusForRegion.mockImplementation(() => 9999);
  });

  it('must query the api until distance exceeds maxium radius', async () => {
    getRadiusForRegion.mockImplementation((lat, lng, latD, lngD) => {
      expect(lat).toBe(1);
      expect(lng).toBe(2);
      expect(latD).toBe(3);
      expect(lngD).toBe(4);

      return 18;
    });

    const action = regionChange(1, 2, 3, 4);
    const input$ = Observable.of(action);

    const api = {
      search: jest.fn(),
    };

    api.search
      .mockReturnValueOnce(
        makeResponse({
          businesses: [{ distance: 3 }, { distance: 5 }, { distance: 7 }],
        }),
      )
      .mockReturnValueOnce(
        makeResponse({
          businesses: [{ distance: 13 }, { distance: 18 }, { distance: 21 }],
        }),
      );

    const output$ = epic(input$, null, { api, config: defaultConfig });
    const output = await output$.toArray().toPromise();
    const businesses = R.compose(
      R.flatten,
      R.map(R.path(['payload', 'businesses'])),
    )(output);

    expect(api.search).toHaveBeenCalledTimes(2);
    expect(businesses.length).toBe(5);
  });

  it('must query the api until all pages are exhausted', async () => {
    const action = regionChange(1, 2, 3, 4);
    const input$ = Observable.of(action);

    const api = {
      search: jest.fn(),
    };

    api.search
      .mockReturnValueOnce(
        makeResponse({
          total: 2,
          businesses: [{ distance: 3 }],
        }),
      )
      .mockReturnValueOnce(
        makeResponse({
          total: 3,
          businesses: [{ distance: 4 }],
        }),
      )
      .mockReturnValueOnce(
        makeResponse({
          total: 3,
          businesses: [{ distance: 5 }, { distance: 6 }, { distance: 7 }],
        }),
      );

    const output$ = epic(input$, null, { api, config: defaultConfig });
    const output = await output$.toArray().toPromise();
    const businesses = R.compose(
      R.flatten,
      R.map(R.path(['payload', 'businesses'])),
    )(output);

    expect(businesses.length).toBe(5);
    expect(api.search).toHaveBeenCalledTimes(3);
  });

  it('must limit the amount of requests per region change', async () => {
    const action = regionChange(1, 2, 3, 4);
    const input$ = Observable.of(action);

    const api = {
      search: jest.fn(),
    };

    api.search.mockReturnValue(
      makeResponse({
        businesses: [{ distance: 999 }],
      }),
    );

    const config = {
      maxConsecutiveRequests: 2,
    };
    const output$ = epic(input$, null, { api, config });

    await output$.toPromise();

    expect(api.search).toHaveBeenCalledTimes(2);
  });
});

describe('exhaustiveFetch', () => {
  it('must return Observable', () => {
    const getter = () =>
      Promise.resolve({
        count: 0,
        total: 0,
      });
    const result = exhaustiveFetch(getter);

    expect(result).toBeInstanceOf(Observable);
  });

  it('must emit the response returned by getter', async () => {
    const getter = jest.fn();

    getter.mockReturnValue(Promise.resolve({ count: 1, total: 1 }));

    const emittedValues = await exhaustiveFetch(getter).toArray().toPromise();

    expect(emittedValues).toEqual([{ count: 1, total: 1 }]);
  });

  it('must call getter with an initial offset of 0', async () => {
    const getter = jest.fn();

    getter.mockReturnValue(Promise.resolve({ count: 1, total: 1 }));
    await exhaustiveFetch(getter).toPromise();

    expect(getter).toHaveBeenCalledWith(0);
  });

  it('must call the getter until accumulated count exceeds total', async () => {
    const getter = jest.fn();

    getter
      .mockReturnValueOnce(Promise.resolve({ count: 1, total: 2 }))
      .mockReturnValueOnce(Promise.resolve({ count: 1, total: 2 }));

    await exhaustiveFetch(getter).toPromise();

    expect(getter).toHaveBeenCalledTimes(2);
    expect(getter).toHaveBeenCalledWith(0);
    expect(getter).toHaveBeenCalledWith(1);
  });

  it('must emit values returned by the getter', async () => {
    const getter = jest.fn();

    getter
      .mockReturnValueOnce(Promise.resolve({ count: 1, total: 2 }))
      .mockReturnValueOnce(Promise.resolve({ count: 1, total: 2 }));

    const emittedValues = await exhaustiveFetch(getter).toArray().toPromise();

    expect(emittedValues).toEqual([
      { count: 1, total: 2 },
      { count: 1, total: 2 },
    ]);
  });

  // Currently calls fetcher one time too many
  it('can be aborted using operators', async () => {
    const limit = 2;
    const getter = jest.fn();

    getter.mockReturnValue(Promise.resolve({ count: 1, total: 10 }));

    await exhaustiveFetch(getter).take(limit).toPromise();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          expect(getter).toHaveBeenCalledTimes(limit);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });
});
