// @flow
import R from 'ramda';

type Point = {
  x: number,
  y: number,
};

export type Cluster = {
  x: number,
  y: number,
  points: Point[],
};

function cluster(
  dimensions: { cols: number, rows: number },
  bbox: { minX: number, minY: number, maxX: number, maxY: number },
  points: Point[],
): Cluster[] {
  const { cols, rows } = dimensions;
  const { minX, minY, maxX, maxY } = bbox;
  const [spanX, spanY] = [(maxX - minX) / cols, (maxY - minY) / rows];

  const grid: Point[][][] = [];

  points.forEach(point => {
    const { x, y } = point;
    const [col, row] = [
      Math.floor((x - minX) / spanX),
      Math.floor((y - minY) / spanY),
    ];

    if (!grid[col]) {
      grid[col] = [];
    }

    if (!grid[col][row]) {
      grid[col][row] = [];
    }

    grid[col][row].push(point);
  });

  const clusters: Cluster[] = [];

  for (let col = 0; col < cols; col += 1) {
    if (grid[col]) {
      for (let row = 0; row < rows; row += 1) {
        if (grid[col][row]) {
          const cellPoints = grid[col][row];
          const [x, y] = ['x', 'y']
            .map(dim => R.propOr(0, dim))
            .map(f => cellPoints.map(f))
            .map(R.mean);

          clusters.push({ x, y, points: cellPoints });
        }
      }
    }
  }

  return clusters;
}

export default cluster;
