// @flow
export type Region = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
};

export type Business = {
  id: string,
  longitude: number,
  latitude: number,
  name?: string,
};
