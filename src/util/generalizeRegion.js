// @flow
import R from 'ramda';
import SphericalMercator from 'sphericalmercator';
import type { Region } from 'types/Region';

type GeneralRegion = {
  westLng: number,
  southLat: number,
  eastLng: number,
  northLat: number,
};

export const factory = (globeWidth: number, maxPrecision: number = 20) => {
  // TODO: Re-implement mercator projection
  const mercator = new SphericalMercator({
    size: globeWidth,
  });
  const xy = (ll: number[]): number[] => mercator.px(ll, 0);
  const ll = (px: number[]): number[] => mercator.ll(px, 0);

  // Wraps X on 0 and globeWidth
  const normX = R.flip(R.mathMod)(globeWidth);

  // Binds Y between 0 and globeWidth
  const normY = R.compose(R.max(0), R.min(globeWidth));

  /**
   * Returns approximated region which encloses the original region
   *
   * Function will return the same region for closely similar sets of coordinates, zoom level, map rotation and layout.
   *
   * @param {Region} region Visible region
   * @param {Object} mapLayout Layout of the visible map
   * @param {number} mapLayout.width Width of the map in pixels
   * @param {number} mapLayout.height Height of the map in pixels
   * @returns {GeneralRegion} Generalized region with properties: westLng, eastLng, northLat, southLat
   */
  return function generalizeRegion(
    region: Region,
    mapLayout: { width: number, height: number },
  ): GeneralRegion {
    const { latitude, longitude, longitudeDelta } = region;
    const { width, height } = mapLayout;

    // Find the length of the largest side of the map
    const maxExtent = Math.max(width, height);

    // Exactly much pixels would it take to show full map at current zoom level?
    // Longitude is easier to deal with because its symmetrical.
    const fullMapWidth = 360 / longitudeDelta * width;

    // What fraction of the full map would the current segment take if it was perfectly square?
    const squaredRegionFraction = maxExtent / fullMapWidth;

    // What power do you need to apply to the extent of the region to get full extent of the region?
    const regionExponent = Math.floor(Math.log2(1 / squaredRegionFraction));

    // Loosen the result to the nearest greater fraction, for example 0.125 for 0.067
    const span = globeWidth / 2 ** Math.min(maxPrecision, regionExponent);

    // Find the XY coordinates for the center and corners of the loosened region
    const [x, y] = xy([longitude, latitude]);
    const xMin = Math.floor(x / span) * span - span / 2;
    const yMin = Math.floor(y / span) * span - span / 2;
    const xMax = xMin + span * 2;
    const yMax = yMin + span * 2;

    // Retrieve geographical coordinates for map boundaries using reverse projection
    const [westLng, southLat] = ll([normX(xMin), normY(yMax)]);
    const [eastLng, northLat] = ll([normX(xMax), normY(yMin)]);

    return { westLng, southLat, eastLng, northLat };
  };
};

export default factory(256, 20);
