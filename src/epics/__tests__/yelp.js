import { Observable } from 'rxjs';
import { ActionsObservable } from 'redux-observable';
import R from 'ramda';
import { regionChange } from 'actions/map';
import { addBusinesses } from 'actions/businesses';
import { getRadiusForRegion } from 'util/geo';
import epic, { exhaustiveFetch } from '../yelp';

jest.mock('util/geo');

const makeResponse = R.compose(
  Promise.resolve.bind(Promise),
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

    const action = regionChange({
      latitude: 1,
      longitude: 2,
      latitudeDelta: 3,
      longitudeDelta: 4,
    });
    const input$ = ActionsObservable.of(action);

    const api = {
      search: jest.fn(),
    };

    api.search
      .mockReturnValueOnce(
        makeResponse({
          businesses: [
            { id: 1, distance: 3 },
            { id: 2, distance: 5 },
            { id: 3, distance: 7 },
          ],
        }),
      )
      .mockReturnValueOnce(
        makeResponse({
          businesses: [
            { id: 4, distance: 13 },
            { id: 5, distance: 18 },
            { id: 6, distance: 21 },
          ],
        }),
      );

    const output$ = epic(input$, null, { api, config: defaultConfig });
    const output = await output$.toArray().toPromise();

    expect(api.search).toHaveBeenCalledTimes(2);
    expect(output).toEqual([
      addBusinesses([
        { id: 1, distance: 3 },
        { id: 2, distance: 5 },
        { id: 3, distance: 7 },
        { id: 4, distance: 13 },
        { id: 5, distance: 18 },
      ]),
    ]);
  });

  it('must query the api until all pages are exhausted', async () => {
    const action = regionChange({
      latitude: 1,
      longitude: 2,
      latitudeDelta: 3,
      longitudeDelta: 4,
    });
    const input$ = ActionsObservable.of(action);

    const api = {
      search: jest.fn(),
    };

    api.search
      .mockReturnValueOnce(
        makeResponse({
          businesses: [{ id: 1, distance: 3 }],
        }),
      )
      .mockReturnValueOnce(
        makeResponse({
          businesses: [{ id: 2, distance: 4 }],
        }),
      )
      .mockReturnValueOnce(
        makeResponse({
          businesses: [
            { id: 3, distance: 5 },
            { id: 4, distance: 6 },
            { id: 5, distance: 7 },
          ],
        }),
      )
      .mockReturnValueOnce(
        makeResponse({
          businesses: [],
        }),
      );

    const output$ = epic(input$, null, { api, config: defaultConfig });
    const output = await output$.toArray().toPromise();

    expect(output).toEqual([
      addBusinesses([
        { id: 1, distance: 3 },
        { id: 2, distance: 4 },
        { id: 3, distance: 5 },
        { id: 4, distance: 6 },
        { id: 5, distance: 7 },
      ]),
    ]);
    expect(api.search).toHaveBeenCalledTimes(4);
  });

  it('must limit the amount of requests per region change', async () => {
    const action = regionChange({
      latitude: 1,
      longitude: 2,
      latitudeDelta: 3,
      longitudeDelta: 4,
    });
    const input$ = ActionsObservable.of(action);

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

  // FIXME: Use fake scheduler
  // Jest fake timers do not work here for some reason
  it('should abort pagination chain when new action comes through', async () => {
    const api = {
      search: jest.fn(),
    };

    api.search.mockImplementation(
      () =>
        new Promise(resolve => {
          // Simulate delayed response
          setTimeout(() => {
            resolve({
              businesses: [{ distance: 999 }],
            });
          }, 300);
        }),
    );

    const config = {
      maxConsecutiveRequests: 100,
      businessesPerAction: 1,
    };

    const input$ = new ActionsObservable(
      Observable.create(observer => {
        observer.next(
          regionChange({
            latitude: 1,
            longitude: 2,
            latitudeDelta: 3,
            longitudeDelta: 4,
          }),
        );

        // Simulate delayed action
        setTimeout(() => {
          observer.next(
            regionChange({
              latitude: 5,
              longitude: 6,
              latitudeDelta: 7,
              longitudeDelta: 8,
            }),
          );
          observer.complete();
        }, 450);
      }),
    );

    const output$ = epic(input$, null, { api, config });

    await output$.take(3).toPromise();

    // Second action is supposed to come through after the beginning of the
    // second request for first region.
    expect(api.search).toHaveBeenCalledTimes(4);
    expect(api.search.mock.calls).toMatchObject([
      [{ latitude: 1, longitude: 2, offset: 0 }],
      [{ latitude: 1, longitude: 2, offset: 1 }],
      [{ latitude: 5, longitude: 6, offset: 0 }],
      [{ latitude: 5, longitude: 6, offset: 1 }],
    ]);
  });
});

describe('exhaustiveFetch', () => {
  it('must return Observable', () => {
    const getter = jest.fn();

    getter.mockReturnValueOnce(Promise.resolve({ count: 0 }));

    const result = exhaustiveFetch(getter, response => response.count);

    expect(result).toBeInstanceOf(Observable);
  });

  it('must emit the response returned by getter', async () => {
    const getter = jest.fn();

    getter
      .mockReturnValueOnce(Promise.resolve({ count: 1 }))
      .mockReturnValueOnce(Promise.resolve({ count: 0 }));

    const emittedValues = await exhaustiveFetch(
      getter,
      response => response.count,
    )
      .toArray()
      .toPromise();

    expect(emittedValues).toEqual([{ count: 1 }, { count: 0 }]);
  });

  it('must call getter with an initial offset of 0', async () => {
    const getter = jest.fn();

    getter.mockReturnValueOnce(Promise.resolve({ count: 0 }));

    await exhaustiveFetch(getter, response => response.count).toPromise();

    expect(getter).toHaveBeenCalledWith(0);
  });

  it('must support custom count getter', async () => {
    const fetcher = jest.fn();

    fetcher
      .mockReturnValueOnce(Promise.resolve({ entries: ['foo', 'bar'] }))
      .mockReturnValueOnce(Promise.resolve({ entries: ['baz'] }))
      .mockReturnValueOnce(Promise.resolve({ entries: [] }));

    await exhaustiveFetch(fetcher, r => r.entries.length).toPromise();

    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(fetcher).toHaveBeenCalledWith(0);
    expect(fetcher).toHaveBeenCalledWith(2);
    expect(fetcher).toHaveBeenCalledWith(3);
  });

  it('must call the getter as long as count is positive', async () => {
    const getter = jest.fn();

    getter
      .mockReturnValueOnce(Promise.resolve({ count: 2 }))
      .mockReturnValueOnce(Promise.resolve({ count: 1 }))
      .mockReturnValueOnce(Promise.resolve({ count: 0 }));

    await exhaustiveFetch(getter, response => response.count).toPromise();

    expect(getter).toHaveBeenCalledTimes(3);
    expect(getter).toHaveBeenCalledWith(0);
    expect(getter).toHaveBeenCalledWith(2);
    expect(getter).toHaveBeenCalledWith(3);
  });

  it('must emit values returned by the getter', async () => {
    const getter = jest.fn();

    getter
      .mockReturnValueOnce(Promise.resolve({ count: 2, foo: 'bar' }))
      .mockReturnValueOnce(Promise.resolve({ count: 1, bar: 'baz' }))
      .mockReturnValueOnce(Promise.resolve({ count: 0, baz: 'foo' }));

    const emittedValues = await exhaustiveFetch(
      getter,
      response => response.count,
    )
      .toArray()
      .toPromise();

    expect(emittedValues).toEqual([
      { count: 2, foo: 'bar' },
      { count: 1, bar: 'baz' },
      { count: 0, baz: 'foo' },
    ]);
  });

  it('can be controlled by the consumer', async () => {
    const limit = 2;
    const getter = jest.fn();

    getter.mockReturnValue(Promise.resolve({ count: 1 }));

    await exhaustiveFetch(getter, response => response.count)
      .take(limit)
      .toPromise();

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
