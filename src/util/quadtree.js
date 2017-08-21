// @flow

type Point = {
  x: number,
  y: number,
};

type Data = Point & {
  data: any,
};

const DEFAULT_CAPACITY = 4;

export class Boundaries {
  static create(x: number, y: number, w: number, h: number) {
    return new Boundaries(x, y, w, h);
  }

  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(point: Point) {
    const { x: x1, y: y1, width: w, height: h } = this;
    const { x: x2, y: y2 } = point;

    return x1 <= x2 && x2 < x1 + w && y1 <= y2 && y2 < y1 + h;
  }

  overlaps(other: Boundaries) {
    const { x: x1, y: y1, width: w1, height: h1 } = this;
    const { x: x2, y: y2, width: w2, height: h2 } = other;

    return x1 + w1 > x2 && x1 <= x2 + w2 && y1 + h1 > y2 && y1 <= y2 + h2;
  }

  subdivide(): Boundaries[] {
    const { x, y } = this;
    const hw = this.width / 2;
    const hh = this.height / 2;

    return [[0, 0], [hw, 0], [0, hh], [hw, hh]].map(
      ([ox, oy]) => new Boundaries(x + ox, y + oy, hw, hh),
    );
  }
}

export class Node {
  static create(boundaries: Boundaries, capacity: number = DEFAULT_CAPACITY) {
    return new Node(boundaries, undefined, undefined, capacity);
  }

  boundaries: Boundaries;
  capacity: number;
  points: Data[];
  nodes: Node[];

  constructor(
    boundaries: Boundaries,
    points: Data[] = [],
    nodes: Node[] = [],
    capacity: number = DEFAULT_CAPACITY,
  ) {
    this.boundaries = boundaries;
    this.points = points;
    this.nodes = nodes;
    this.capacity = capacity;
  }

  insert(point: Data) {
    if (!this.boundaries.contains(point)) {
      return this;
    }

    if (this.points.length < this.capacity) {
      return new Node(
        this.boundaries,
        this.points.concat([point]),
        undefined,
        this.capacity,
      );
    }

    if (this.nodes.length === 0) {
      return this.subdivide().insert(point);
    }

    return new Node(
      this.boundaries,
      this.points,
      this.nodes.map(node => node.insert(point)),
      this.capacity,
    );
  }

  subdivide(): Node {
    return new Node(
      this.boundaries,
      this.points,
      this.boundaries
        .subdivide()
        .map(boundaries => Node.create(boundaries, this.capacity)),
      this.capacity,
    );
  }

  query(rect: Boundaries): Data[] {
    if (!this.boundaries.overlaps(rect)) {
      return [];
    }

    return this.nodes.reduce(
      (points, node) => points.concat(node.query(rect)),
      this.points.filter(point => rect.contains(point)),
    );
  }
}

export default class Quadtree {
  static create(
    x: number,
    y: number,
    w: number,
    h: number,
    capacity = DEFAULT_CAPACITY,
  ) {
    return new Quadtree(
      new Node(new Boundaries(x, y, w, h), undefined, undefined, capacity),
    );
  }

  root: Node;

  constructor(root: Node) {
    this.root = root;
  }

  insert(x: number, y: number, data: any) {
    return new Quadtree(this.root.insert({ x, y, data }));
  }

  queryRange(x: number, y: number, width: number, height: number) {
    return this.root
      .query(new Boundaries(x, y, width, height))
      .map(({ data }) => data);
  }
}
