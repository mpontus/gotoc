// @flow
declare module 'geolib' {
  /*
   * Coordinates can be supplied in decimal or sexagesimal notations, meaning
   * that both of the following examples are equivalent:
   *
   *    {
   *      latitude: 51.5103,
   *      longitude: 7.49347
   *    }
   *    {
   *      latitude: "51� 31' N",
   *      longitude: "7� 28' E",
   *    }
   */
  declare type Coordinates = {
    latitude: number | string,
    longitude: number | string,
  };

  declare function getDistance(
    start: Coordinates,
    end: Coordinates,
    accuracy?: number,
    precision?: number,
  ): number;

  declare function computeDestinationPoint(
    start: Coordinates,
    distance: number,
    bearing: number,
    radius?: number,
  ): {
    latitude: number,
    longitude: number,
  };
}
