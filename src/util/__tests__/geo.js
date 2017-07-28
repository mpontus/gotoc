import geolib from 'geolib';
import { getDeltasForRadius, getRadiusForRegion } from '../geo';

// Errors to the south, north, and right above equator
const points = [
  ['Nuuk Center, Greenland', 64.177995, -51.739083],
  ['Maua, Kenya', 0.2355187, 37.934525],
  ['Wellington, New Zealand', -41.284526, 174.7712372],
];

describe('geo utils', () => {
  describe('getDeltasForRadius', () => {
    points.forEach(([name, latitude, longitude]) => {
      test(`covers area around ${name}`, () => {
        const start = { latitude, longitude };

        // Coordinates of the point one kilometer into different directions
        const getRelativePoint = direction =>
          geolib.computeDestinationPoint(start, 1000, direction);
        const [north, west, south, east] = [0, 90, 180, 270].map(
          getRelativePoint,
        );

        // Deltas for the radius of one kilometer around the starting point
        const {
          latitude: latitudeDelta,
          longitude: longitudeDelta,
        } = getDeltasForRadius(latitude, longitude, 1000);

        // Verify that relative points fall within delta
        expect(latitudeDelta).toBeGreaterThanOrEqual(
          Math.abs(latitude - north.latitude),
        );
        expect(latitudeDelta).toBeGreaterThanOrEqual(
          Math.abs(latitude - south.latitude),
        );
        expect(longitudeDelta).toBeGreaterThanOrEqual(
          Math.abs(longitude - east.longitude),
        );
        expect(longitudeDelta).toBeGreaterThanOrEqual(
          Math.abs(longitude - west.longitude),
        );
      });

      test(`does not exceed area around ${name}`, () => {
        const start = { latitude, longitude };

        // Coordinates of the point one kilometer into different directions
        const getPoint = direction =>
          geolib.computeDestinationPoint(start, 1001, direction);
        const [north, west, south, east] = [0, 90, 180, 270].map(getPoint);

        // Deltas for the radius of one kilometer around the starting point
        const {
          latitude: latitudeDelta,
          longitude: longitudeDelta,
        } = getDeltasForRadius(latitude, longitude, 1000);

        // Verify that relative points fall within delta
        expect(latitudeDelta).toBeLessThan(Math.abs(latitude - north.latitude));
        expect(latitudeDelta).toBeLessThan(Math.abs(latitude - south.latitude));
        expect(longitudeDelta).toBeLessThan(
          Math.abs(longitude - east.longitude),
        );
        expect(longitudeDelta).toBeLessThan(
          Math.abs(longitude - west.longitude),
        );
      });
    });
  });

  describe('getRadiusForRegion', () => {
    points.forEach(([name, latitude, longitude]) => {
      test(`radius around ${name}`, () => {
        const start = { latitude, longitude };
        const latitudeDelta = 0.2;
        const longitudeDelta = 0.04;

        // Coordinates of the corners of the region
        const cornerCoords = [
          // Top left
          [latitude + latitudeDelta, longitude - longitudeDelta],
          // Top right
          [latitude + latitudeDelta, longitude + longitudeDelta],
          // Bottom left
          [latitude - latitudeDelta, longitude - longitudeDelta],
          // Bottom right
          [latitude - latitudeDelta, longitude + longitudeDelta],
        ];

        // Convert corner coordinates to distance from the starting point
        const cornerDistances = cornerCoords.map(([lat, lng]) =>
          geolib.getDistance(start, {
            lat,
            lng,
          }),
        );

        // Compute radius for slightly greater distances
        const radius = getRadiusForRegion(
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
        );

        // Verify that the returned radius is greater than all distances
        expect(radius).toBe(Math.max.apply(null, cornerDistances));
      });
    });
  });
});
