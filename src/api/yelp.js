// @flow
import R from 'ramda';
import qs from 'query-string';

const processResponse = (response: Response) => response.json();

class YelpApi {
  clientId: string;
  clientSecret: string;
  authPromise: ?Promise<string> = null;
  accessToken: ?string = null;

  constructor(clientId: string, clientSecret: string) {
    Object.assign(this, { clientId, clientSecret });
  }

  authenticate(): Promise<string> {
    if (!this.authPromise) {
      const { clientId, clientSecret } = this;
      // const body = new URLSearchParams();
      const body = qs.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      });

      this.authPromise = fetch('https://api.yelp.com/oauth2/token', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(response => response.json())
        .then(result => {
          this.accessToken = result.access_token;

          return this.accessToken;
        });
    }

    return this.authPromise;
  }

  authFetch(url: string, options: Object = {}) {
    return this.authenticate().then(accessToken => {
      // $FlowFixMe
      const withAccessToken = R.set(
        // $FlowFixMe
        R.lensPath(['headers', 'Authorization']),
        `Bearer ${accessToken}`,
      );

      return fetch(url, withAccessToken(options));
    });
  }

  get(url: string) {
    return this.authFetch(url, {
      method: 'GET',
    }).then(processResponse);
  }

  post(url: string, body: Object) {
    return this.authFetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }).then(processResponse);
  }
}

export default YelpApi;
