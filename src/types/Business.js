// @flow
type Category = {|
  alias: string,
  title: string,
|};

export type Business = {|
  rating: number,
  price: string,
  phone: string,
  id: string,
  is_closed: boolean,
  categoties: Category[],
  review_count: number,
  name: string,
  url: string,
  coordinates: Coordinates,
  image_url: string,
  display_phone: string,
  location: {
    country: string,
    state: string,
    city: string,
    zip_code: string,
    address1: string,
    address2: string,
    address3: string,
    display_address: [string, string],
  },
  distance: number,
  transactions: string[],
|};
