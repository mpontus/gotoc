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
        expect(getDeltasForRadius(latitude, longitude, 1000)).toMatchSnapshot();
      });

      test(`does not exceed area around ${name}`, () => {
        expect(getDeltasForRadius(latitude, longitude, 1000)).toMatchSnapshot();
      });
    });
  });

  describe('getRadiusForRegion', () => {
    points.forEach(([name, latitude, longitude]) => {
      test(`radius around ${name}`, () => {
        const latitudeDelta = 0.2;
        const longitudeDelta = 0.04;

        expect(
          getRadiusForRegion(
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
          ),
        ).toMatchSnapshot();
      });
    });
  });
});
