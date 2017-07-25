// @flow

type Point = {
  x: number,
  y: number,
};

type Data = Point & {
  data: mixed,
};

class Quadtree {
  static create(width: number, height: number) {
    return new Quadtree(width, height);
  }

  width: number;
  height: number;
  points: Data[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  insert(x: number, y: number, data: mixed) {
    this.points.push({ x, y, data });

    return this;
  }

  queryRange(x: number, y: number, width: number, height: number) {
    return this.points
      .filter(({ x: px, y: py }) => px - x < width && py - y < height)
      .map(({ data }) => data);
  }
}

export default Quadtree;
