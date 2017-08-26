// @flow
import type { Feature, Point } from './GeoJSON';
import type { Business } from './Business';

type Properties =
  | {|
      cluster: true,
      cluster_id: number,
      point_count: number,
    |}
  | (Business & { cluster: false });

export type Cluster = Feature<Point, Properties>;
