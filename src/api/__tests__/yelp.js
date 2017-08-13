import withMock from 'with-fetch-mock';
import qs from 'query-string';
import YelpApi from '../yelp';

const api = new YelpApi('foo', 'bar');

it('must authenticate with yelp when making a request', () =>
  withMock(
    async () => {
      const response = await api.get(
        'https://api.yelp.com/v2/search?term=food&location=San+Francisco',
      );

      expect(response).toEqual({ foo: 'bar' });
    },
    (url, options) => {
      expect(url).toBe('https://api.yelp.com/oauth2/token');
      expect(options.method).toBe('POST');
      expect(qs.parse(options.body)).toEqual({
        grant_type: 'client_credentials',
        client_id: 'foo',
        client_secret: 'bar',
      });

      return {
        access_token: 'baz',
      };
    },
    (url, options) => {
      expect(url).toBe(
        'https://api.yelp.com/v2/search?term=food&location=San+Francisco',
      );
      expect(options.headers.Authorization).toBe('Bearer baz');

      return {
        foo: 'bar',
      };
    },
  ));
