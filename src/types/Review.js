// @flow
export type Review = {
  rating: number,
  user: {
    image_url: ?string,
    name: string,
  },
  text: string,
  time_created: string,
  url: string,
};
