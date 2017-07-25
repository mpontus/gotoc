import Quadtree from '../quadtree';

describe('quadtree', () => {
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
