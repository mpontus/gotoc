// @flow
export type Location = {|
  timestamp: number,
  coords: {
    speed: number,
    heading: number,
    accuracy: number,
    logitude: number,
    latitude: number,
    altitude: number,
  },
|};
