// @flow
import math from 'mathjs';
import SphericalMercator from 'sphericalmercator';
import type { Region } from 'types/Region';

const GLOBE_WIDTH = 256;
const mercator = new SphericalMercator({
  size: GLOBE_WIDTH,
});

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

export function getRegionEdges(region: Region) {
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

type LatLng = {
  lat: number,
  lng: number,
};

type Boundaries = {
  westLng: number,
  eastLng: number,
  northLat: number,
  southLat: number,
};

export function getRegionBoundaries(
  { lat, lng }: LatLng,
  zoom: number,
): Boundaries {
  const [x, y] = mercator.px([lng, lat], zoom);
  const [ix, iy] = [x, y].map(n => Math.floor(n / GLOBE_WIDTH));
  const [nw, se] = [
    [ix * GLOBE_WIDTH, iy * GLOBE_WIDTH],
    [(ix + 1) * GLOBE_WIDTH, (iy + 1) * GLOBE_WIDTH],
  ].map(px => mercator.ll(px, zoom));

  return {
    westLng: nw[0],
    eastLng: se[0],
    northLat: nw[1],
    southLat: se[1],
  };
}

export function getZoomLevel(longitudeDelta: number, width: number) {
  return Math.round(
    Math.log(width * 360 / longitudeDelta / GLOBE_WIDTH) / Math.LN2,
  );
}
