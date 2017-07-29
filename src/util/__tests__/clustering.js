import cluster from '../clustering';

describe('clustering', () => {
  it('clusters nearby points based on the grid', () => {
    const dimensions = {
      cols: 4,
      rows: 4,
    };
    const bbox = {
      minX: 0,
      minY: 0,
      maxX: 20,
      maxY: 20,
    };
    const points = [
      {
        x: 6,
        y: 6,
        id: 'foo',
      },
      {
        x: 8,
        y: 8,
        id: 'bar',
      },
      {
        x: 16,
        y: 16,
        id: 'baz',
      },
    ];
    const expectedResult = [
      {
        x: 7,
        y: 7,
        points: [points[0], points[1]],
      },
      {
        x: 16,
        y: 16,
        points: [points[2]],
      },
    ];
    const result = cluster(dimensions, bbox, points);

    expect(result).toEqual(expectedResult);
  });

  it('adjusts grid offset to mitigate microchanges in bounding box', () => {
    const dimensions = {
      cols: 4,
      rows: 4,
    };
    const bbox = {
      minX: 2,
      minY: 2,
      maxX: 22,
      maxY: 22,
    };
    const points = [
      {
        x: 6,
        y: 6,
        id: 'foo',
      },
      {
        x: 8,
        y: 8,
        id: 'bar',
      },
      {
        x: 16,
        y: 16,
        id: 'baz',
      },
    ];
    const expectedResult = [
      {
        x: 7,
        y: 7,
        points: [points[0], points[1]],
      },
      {
        x: 16,
        y: 16,
        points: [points[2]],
      },
    ];
    const result = cluster(dimensions, bbox, points);

    expect(result).toEqual(expectedResult);
  });
});
