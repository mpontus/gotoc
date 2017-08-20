import generalizeRegion, { factory } from '../generalizeRegion';

// Helpful snippets for REPL:
// var mercator = new SphericalMercator({ size: 256 });
// var center = c => mercator.ll([c, c], 0);
// var deltas = (c, s) => {
//   const [sw, ne] = [c - s / 2, c + s / 2].map(n => mercator.ll([n, n], 0));

//   return [ne[0] - sw[0], sw[1] - ne[1]];
// };

// See https://goo.gl/LXmzr9
function detectPrecision(a) {
  let e = 1;
  while (Math.round(a * e) / e !== a) e *= 10;
  return Math.log(e) / Math.LN10;
}

/**
 * Asymmetric matcher for numbers with fixed precision
 */
class NumberMatching {
  $$typeof = Symbol.for('jest.asymmetricMatcher');

  constructor(expected, precision) {
    this.expected = expected;
    this.precision = precision;
  }

  asymmetricMatch(actual) {
    const fixedExpected = this.expected.toFixed(this.precision);
    const fixedActual = actual.toFixed(this.precision);

    return fixedExpected === fixedActual;
  }

  toAsymmetricMatcher() {
    return this.expected.toFixed(this.precision);
  }
}

/**
 * Creates asymmetric matcher for given number
 *
 * @param {number} expected Expected number
 * @returns {NumberMatching} Asymmetric matcher
 */
const approx = expected =>
  new NumberMatching(expected, detectPrecision(expected));

describe('generalizeRegion', () => {
  test('region depends on coordinates', () => {
    // Viewport of size 100x100 px
    const vp = { width: 100, height: 100 };

    // We will be expecting the region which is centered at 3/8:3/8 of size 1/2
    const expectedRegion = [-135, approx(-40.9799), 45, approx(79.1713)];

    // Begin with region centered at 1/4:1/4 of size 1/4 of the map
    expect(
      generalizeRegion(
        {
          latitude: 66.5132,
          longitude: -90,
          latitudeDelta: 38.1914,
          longitudeDelta: 90,
        },
        vp,
      ),
    ).toEqual(expectedRegion);

    // Move it just short of the center
    expect(
      generalizeRegion(
        {
          latitude: 1.406,
          longitude: -1.406,
          latitudeDelta: 81.9427,
          longitudeDelta: 90,
        },
        vp,
      ),
    ).toEqual(expectedRegion);

    // Once we pass the center of the map the region should change
    expect(
      generalizeRegion(
        {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 81.9597,
          longitudeDelta: 90,
        },
        vp,
      ),
    ).toEqual([-45, approx(-79.1713), 135, approx(40.9799)]);
  });

  test('region depends on zoom level', () => {
    // Viewport of size 100x100 px
    const vp = { width: 100, height: 100 };

    // Region centered at 1/8:1/8 spanning half of the entire map
    const expectedRegion = [-45, approx(-79.1713), 135, approx(40.9799)];

    // Begin with a region centered at 0:0, and spanning 1/4 of the entire map
    expect(
      generalizeRegion(
        {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 81.9597,
          longitudeDelta: 90,
        },
        vp,
      ),
    ).toEqual(expectedRegion);

    // Zoom in by shrinking the region to 1/2 of its original size
    expect(
      generalizeRegion(
        {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 43.8861,
          longitudeDelta: 45,
        },
        vp,
      ),
    ).toEqual([-22.5, approx(-55.7766), 67.5, approx(21.943)]);

    // Zoom out by expanding region just above 1/2 of its original size
    expect(
      generalizeRegion(
        {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 45.1874,
          longitudeDelta: 46.40625,
        },
        vp,
      ),
    ).toEqual(expectedRegion);
  });

  test('region is independent from map rotation', () => {
    const verticalVp = { width: 25, height: 100 };
    const verticalRegion = {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 81.9597,
      longitudeDelta: 22.5,
    };

    const horizontalVp = { width: 100, height: 25 };
    const horizontalRegion = {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 22.3568,
      longitudeDelta: 90,
    };

    // Region centered at 1/8:1/8 spanning half of the entire map
    const expectedRegion = [-45, approx(-79.1713), 135, approx(40.9799)];

    expect(generalizeRegion(verticalRegion, verticalVp)).toEqual(
      expectedRegion,
    );

    expect(generalizeRegion(horizontalRegion, horizontalVp)).toEqual(
      expectedRegion,
    );
  });

  test('is bound by latitude', () => {
    // Square viewport
    const vp = { width: 100, height: 100 };

    // Region centered at 1/2:1/8 of size 1/4:1/4
    expect(
      generalizeRegion(
        {
          latitude: 79.1713,
          longitude: 0,
          latitudeDelta: 18.5378,
          longitudeDelta: 90,
        },
        vp,
      ),
    ).toEqual([-45, approx(40.9799), 135, approx(85.05113)]);

    // Region centered at 1/2:7/8 of size 1/4:1/4
    expect(
      generalizeRegion(
        {
          latitude: -79.1713,
          longitude: 0,
          latitudeDelta: 18.5378,
          longitudeDelta: 90,
        },
        vp,
      ),
    ).toEqual([-45, approx(-85.05113), 135, approx(-40.9799)]);
  });

  test('wraps on longitude', () => {
    // Square viewport
    const vp = { width: 100, height: 100 };

    // We expect a region that is centered at 1/8:0 of size 1/2
    const expectedRegion = [135, approx(-79.1713), -45, approx(40.9799)];

    // An actual region is centered at the equator at the edge of the map
    expect(
      generalizeRegion(
        {
          latitude: 0,
          longitude: -180,
          latitudeDelta: 81.9597,
          longitudeDelta: 90,
        },
        vp,
      ),
    ).toEqual(expectedRegion);

    // A different way to express the same thing
    expect(
      generalizeRegion(
        {
          latitude: 0,
          longitude: 180,
          latitudeDelta: 81.9597,
          longitudeDelta: 90,
        },
        vp,
      ),
    ).toEqual(expectedRegion);
  });

  test('region will not shrink past certain threshold', () => {
    // Lower maximum precision to limit the smallest resolved region take up 1/4 of the map
    const ownGeneralizeRegion = factory(256, 3);

    // Square viewport
    const vp = { width: 100, height: 100 };

    // Expected region is centered at 1/8,1/8 and is 1/4 of the map in size
    const expectedRegion = [-22.5, approx(-55.7766), 67.5, approx(21.943)];

    // The largest region which will resolve to smallest possible region
    expect(
      ownGeneralizeRegion(
        {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 43.8861,
          longitudeDelta: 45,
        },
        vp,
      ),
    ).toEqual(expectedRegion);

    // The input region twice as small should resolve to the same region
    expect(
      ownGeneralizeRegion(
        {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 25.3568,
          longitudeDelta: 22.5,
        },
        vp,
      ),
    ).toEqual(expectedRegion);

    // But the region twice as large should resolve to different region
    expect(
      ownGeneralizeRegion(
        {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 81.9598,
          longitudeDelta: 90,
        },
        vp,
      ),
    ).toEqual([-45, approx(-79.1713), 135, approx(40.9799)]);
  });
});
