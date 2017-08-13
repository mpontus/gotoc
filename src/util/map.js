/* eslint-disable import/prefer-default-export */
// @flow
import type { Region } from 'types/Region';

export function getRegionBoundaries(region: Region) {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

  const [w, e] = [-1, +1]
    .map(m => m * longitudeDelta / 2)
    .map(d => d + longitude + 180)
    .map(l => l % 360 - 180);

  // FIXME: this is not accurate
  const [s, n] = [-1, +1]
    .map(m => m * latitudeDelta / 2)
    .map(d => d + latitude)
    .map(d => Math.max(d, -85.05113))
    .map(d => Math.min(d, +85.05113));

  return [n, w, s, e];
}
