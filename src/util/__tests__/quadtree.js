import Quadtree, { Node, Boundaries } from '../quadtree';

describe('Quadtree', () => {
  it('returns points in range', () => {
    const [data1, data2, data3] = ['foo', 'bar', 'baz'];

    const qt = Quadtree.create(100, 100)
      .insert(30, 30, data1)
      .insert(50, 50, data2)
      .insert(70, 70, data3);

    const items = qt.queryRange(25, 25, 30, 30);

    expect(items).toEqual([data1, data2]);
  });
});

describe('Boundaries', () => {
  it('must correctly detect the containment of points', () => {
    const boundaries = new Boundaries(10, 10, 10, 10);

    expect(boundaries.contains({ x: 10, y: 10 })).toBe(true);
    expect(boundaries.contains({ x: 15, y: 15 })).toBe(true);
    expect(boundaries.contains({ x: 10, y: 20 })).toBe(false);
  });

  it('must correctly detect rectangle intersection', () => {
    // A overlaps B
    expect(
      Boundaries.create(10, 10, 10, 10).overlaps(
        Boundaries.create(5, 5, 20, 20),
      ),
    ).toBe(true);
    // B overlaps A
    expect(
      Boundaries.create(5, 5, 20, 20).overlaps(
        Boundaries.create(10, 10, 10, 10),
      ),
    ).toBe(true);
    // A touches B on the right side
    expect(
      Boundaries.create(0, 0, 10, 10).overlaps(
        Boundaries.create(10, 0, 10, 10),
      ),
    ).toBe(false);
    // A touches B on the left side
    expect(
      Boundaries.create(10, 0, 10, 10).overlaps(
        Boundaries.create(0, 0, 10, 10),
      ),
    ).toBe(true);
  });
});

describe('Node', () => {
  it('returns its own points when queried', () => {
    const node = new Node(new Boundaries(0, 0, 100, 100), [
      { x: 10, y: 10, data: 'foo' },
      { x: 20, y: 20, data: 'bar' },
      { x: 30, y: 30, data: 'baz' },
    ]);

    const result = node.query(new Boundaries(20, 20, 11, 11));

    expect(result).toEqual([
      { x: 20, y: 20, data: 'bar' },
      { x: 30, y: 30, data: 'baz' },
    ]);
  });

  it('must query it descendants for extra points', () => {
    const node = new Node(
      new Boundaries(0, 0, 100, 100),
      [{ x: 60, y: 60, data: 'foo' }],
      [
        new Node(new Boundaries(0, 0, 100, 50), [
          { x: 20, y: 20, data: 'bar' },
        ]),
        new Node(new Boundaries(0, 50, 100, 50), [
          { x: 70, y: 70, data: 'bar' },
        ]),
      ],
    );

    const result = node.query(new Boundaries(55, 55, 20, 20));

    expect(result).toEqual([
      { x: 60, y: 60, data: 'foo' },
      { x: 70, y: 70, data: 'bar' },
    ]);
  });
});
