// @flow

type Point = {
  latitude: number,
  longitude: number,
};

export type Cluster = {
  latitude: number,
  longitude: number,
  points: Point[],
};
