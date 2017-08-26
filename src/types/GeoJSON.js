// @flow
/* eslint-disable no-use-before-define */
// Inspired by https://github.com/vkurchatkin/geojson-flow

/**
 * 2.1 Geometry Objects
 * http://geojson.org/geojson-spec.html#geometry-objects
 */
export type GeometryObject =
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon
  | GeometryCollection<*>;

/**
* 2.1.1. Positions
* http://geojson.org/geojson-spec.html#positions
*/
type Position = [number, number];

/**
* 2.1.2. Point
* http://geojson.org/geojson-spec.html#point
*/
export type Point = {
  type: 'Point',
  coordinates: Position,
};

/**
* 2.1.3. MultiPoint
* http://geojson.org/geojson-spec.html#multipoint
*/
export type MultiPoint = {
  type: 'MultiPoint',
  coordinates: Array<Position>,
};

/**
* 2.1.4. LineString
* http://geojson.org/geojson-spec.html#linestring
*/
export type LineString = {
  type: 'LineString',
  coordinates: Array<Position>, // TODO it should be > 2, but we can't validate it statically (maybe [Position, Position] would work?)
};

/**
* 2.1.5. MultiLineString
* http://geojson.org/geojson-spec.html#multilinestring
*/
export type MultiLineString = {
  type: 'MultiLineString',
  coordinates: Array<Array<Position>>,
};

/**
* 2.1.6. Polygon
* http://geojson.org/geojson-spec.html#polygon
*/
export type Polygon = {
  type: 'Polygon',
  coordinates: Array<Array<Position>>,
};

/**
* 2.1.7. MultiPolygon
* http://geojson.org/geojson-spec.html#multipolygon
*/
export type MultiPolygon = {
  type: 'MultiPolygon',
  coordinates: Array<Array<Array<Position>>>,
};

/**
* 2.1.8 Geometry Collection
* http://geojson.org/geojson-spec.html#geometry-collection
*/
export type GeometryCollection<T> = {
  type: 'GeometryCollection',
  geometries: Array<T & GeometryObject>, // TODO make generic
};

/**
 * 2.2. Feature Objects
 * http://geojson.org/geojson-spec.html#geometry-collection
 */
export type Feature<G, T> = {
  type: 'Feature',
  geometry: G & GeometryObject,
  properties: T,
};
