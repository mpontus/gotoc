// @flow
import math from 'mathjs';
import type { Region } from 'types/Region';

const GLOBE_WIDTH = 256;

// I don't know how this works:
// https://math.stackexchange.com/questions/2391556/mercator-projection-finding-boundaries-for-latitude-and-latitudedelta
const [computeT, computeU, computeS, computeN] = math.compile([
  'tan(lat/2 + pi/4)',
  '(t + 1/t)/2 * tan(latD/2)',
  '2 * atan(t / (u + sqrt(1 + u^2))) - pi/2',
  '2 * atan(t * (u + sqrt(1 + u^2))) - pi/2',
]);

function computeLatBounds(lat, latD) {
  const t = computeT.eval({ lat });
  const u = computeU.eval({ t, latD });
  const latS = computeS.eval({ t, u });
  const latN = computeN.eval({ t, u });

  return [latS, latN];
}

export function getRegionBoundaries(region: Region) {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

  const [westLng, eastLng] = [-1, +1]
    .map(m => m * longitudeDelta / 2)
    .map(d => d + longitude + 180)
    .map(l => l % 360 - 180);

  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;

  const [southLat, northLat] = computeLatBounds(
    latitude * deg2rad,
    latitudeDelta * deg2rad,
  ).map(rad => rad * rad2deg);

  return [westLng, southLat, eastLng, northLat];
}

export function getZoomLevel(region: Region, width: number) {
  const { longitudeDelta } = region;

  return Math.round(
    Math.log(width * 360 / longitudeDelta / GLOBE_WIDTH) / Math.LN2,
  );
}
