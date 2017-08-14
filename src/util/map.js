// @flow
import type { Region } from 'types/Region';

const GLOBE_WIDTH = 256;

export function getRegionBoundaries(region: Region) {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

  const [westLng, eastLng] = [-1, +1]
    .map(m => m * longitudeDelta / 2)
    .map(d => d + longitude + 180)
    .map(l => l % 360 - 180);

  // FIXME: this is not accurate
  const [southLat, northLat] = [-1, +1]
    .map(m => m * latitudeDelta / 2)
    .map(d => d + latitude)
    .map(d => Math.max(d, -85.05113))
    .map(d => Math.min(d, +85.05113));

  return [westLng, southLat, eastLng, northLat];
}

export function getZoomLevel(region: Region, width: number) {
  const { longitudeDelta } = region;

  return Math.round(
    Math.log(width * 360 / longitudeDelta / GLOBE_WIDTH) / Math.LN2,
  );
}
