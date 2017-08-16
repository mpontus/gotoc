// @flow
import type { Region } from 'types/Region';

const GLOBE_WIDTH = 256;

export function getRegionBoundaries(region: Region) {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

  const [westLng, eastLng] = [-1, +1]
    .map(m => m * longitudeDelta / 2)
    .map(d => d + longitude + 180)
    .map(l => l % 360 - 180);

  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;

  const lat = latitude * deg2rad;
  const latD = latitudeDelta * deg2rad;

  // I don't know how this works:
  // https://math.stackexchange.com/questions/2391556/mercator-projection-finding-boundaries-for-latitude-and-latitudedelta
  const t = Math.tan(lat / 2 + Math.PI / 4);
  const u = 1 / 2 * (t + 1 / t) * Math.tan(latD / 2);
  const j = u + Math.sqrt(1 + u * u);
  const latS = 2 * Math.atan(t / j) - Math.PI / 2;
  const latN = 2 * Math.atan(t * j) - Math.PI / 2;

  const southLat = latS * rad2deg;
  const northLat = latN * rad2deg;

  return [westLng, southLat, eastLng, northLat];
}

export function getZoomLevel(region: Region, width: number) {
  const { longitudeDelta } = region;

  return Math.round(
    Math.log(width * 360 / longitudeDelta / GLOBE_WIDTH) / Math.LN2,
  );
}
