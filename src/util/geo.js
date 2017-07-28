// @flow
import { computeDestinationPoint, getDistance } from 'geolib';

/**
 * Calculate latitude and longitude deltas for radius around the point.
 *
 * @param {number} latitude North to south coordinate
 * @param {number} longitude East to west coordinate
 * @param {number} radius Radius in meters
 * @returns {object} Deltas in form { latitude: number, longitude: number }
 */
export function getDeltasForRadius(
  latitude: number,
  longitude: number,
  radius: number,
) {
  const start = { latitude, longitude };

  // Calculate coordinates for points around the starting point
  const getRelativePoint = direction =>
    computeDestinationPoint(start, radius, direction);
  const [north, east, south, west] = [0, 90, 180, 270].map(getRelativePoint);

  // Calculate deltas in all directions
  const [deltaNorth, deltaSouth] = [north, south]
    .map(point => point.latitude - latitude)
    .map(Math.abs);
  const [deltaWest, deltaEast] = [east, west]
    .map(point => point.longitude - longitude)
    .map(Math.abs);

  // Choose maximum distance as the delta
  const latitudeDelta = Math.max(deltaNorth, deltaSouth);
  const longitudeDelta = Math.max(deltaEast, deltaWest);

  return {
    latitude: latitudeDelta,
    longitude: longitudeDelta,
  };
}

/**
 * Calcualte radius which encircles the region around specified point
 *
 * @param {number} latitude North to south coordinate of the starting point
 * @param {number} longitude East to west coordinate of the starting point
 * @param {number} latitudeDelta Latitude delta
 * @param {number} longitudeDelta Longitude delta
 * @returns {number} Radius in meters
 */
export function getRadiusForRegion(
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
) {
  const start = { latitude, longitude };
  const topLeft = {
    latitude: latitude - latitudeDelta / 2,
    longitude: longitude - longitudeDelta / 2,
  };
  const bottomRight = {
    latitude: latitude + latitudeDelta / 2,
    longitude: longitude + longitudeDelta / 2,
  };

  return Math.max(getDistance(start, topLeft), getDistance(start, bottomRight));
}
