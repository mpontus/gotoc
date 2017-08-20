declare module 'sphericalmercator' {
  declare class SphericalMercator {
    constructor(options: { size: number }): SphericalMercator,

    ll(px: number[], zoom: number): number[],
    px(ll: number[], zoom: number): number[],
  }

  declare export default typeof SphericalMercator
}
