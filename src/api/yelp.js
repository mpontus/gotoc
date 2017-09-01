// @flow
import R from 'ramda';
import qs from 'query-string';
import type { Business } from 'types/Business';
import type { Review } from 'types/Review';

const processResponse = (response: Response) => response.json();

// Supported Locales
type Locale =
  | 'cs_CZ'
  | 'da_DK'
  | 'de_AT'
  | 'de_CH'
  | 'de_DE'
  | 'en_AU'
  | 'en_BE'
  | 'en_CA'
  | 'en_CH'
  | 'en_GB'
  | 'en_HK'
  | 'en_IE'
  | 'en_MY'
  | 'en_NZ'
  | 'en_PH'
  | 'en_SG'
  | 'en_US'
  | 'es_AR'
  | 'es_CL'
  | 'es_ES'
  | 'es_MX'
  | 'fi_FI'
  | 'fil_PH'
  | 'fr_BE'
  | 'fr_CA'
  | 'fr_CH'
  | 'fr_FR'
  | 'it_CH'
  | 'it_IT'
  | 'ja_JP'
  | 'ms_MY'
  | 'nb_NO'
  | 'nl_BE'
  | 'nl_NL'
  | 'pl_PL'
  | 'pt_BR'
  | 'pt_PT'
  | 'sv_FI'
  | 'sv_SE'
  | 'tr_TR'
  | 'zh_HK'
  | 'zh_TW';

type SearchQuery = {
  // Search term (e.g. "food", "restaurants").
  term?: string,
  // Specifies the combination of "address, neighborhood, city, state or zip, optional country" to be used when searching for businesses.
  location?: string,
  // Latitude of the location you want to search nearby.
  latitude?: number,
  // Required if location is not provided. Longitude of the location you want to search nearby.
  longitude?: number,
  // Search radius in meters
  radius?: number,
  // Categories to filter the search results with.
  categories?: string,
  // Specify the locale to return the business information in.
  locale?: Locale,
  // Number of business results to return.
  limit?: number,
  // Offset the list of returned business results by this amount.
  offset?: number,
  // Sort the results by one of the these modes.
  sort_by?: 'best_match' | 'rating' | 'review_count' | 'distance',
  // Pricing levels to filter the search result with
  price?: number | string,
  // When set to true, only return the businesses open now.
  open_now?: boolean,
  // An integer represending the Unix time in the same timezone of the search location.
  open_at?: number,
  // Additional filters to restrict search results.
  attributes?: | 'hot_and_new'
    | 'hot_and_new'
    | 'waitlist_reservation'
    | 'cashback'
    | 'deals'
    | 'gender_neutral_restrooms'
    | string,
};

type Coordinates = {
  latitude: number,
  longitude: number,
};

export type SearchResult = {
  total: number,
  businesses: Business[],
  region: {
    center: Coordinates,
  },
};

export type ReviewsResult = {
  total: number,
  reviews: Review[],
};

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

  search(query: SearchQuery): Promise<SearchResult> {
    const queryString = qs.stringify(query);
    const url = `https://api.yelp.com/v3/businesses/search?${queryString}`;

    return this.get(url);
  }

  fetchReviews(businessId: string): Promise<ReviewsResult> {
    const url = `https://api.yelp.com/v3/businesses/${businessId}/reviews`;

    return this.get(url);
  }
}

export default YelpApi;
