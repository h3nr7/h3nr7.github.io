/**
 * Fastest next power of 2 doing the same thing as this but 1000x faster
 * 
 * function nextPowerOf2( n:number ) {
 *  return Math.pow( 2, Math.ceil( Math.log( n ) / Math.log( 2 ) ) );
 * }
 * 
 * @param x 
 * @returns 
 */
export function blpo2(x: number) {
  x = x | (x >> 1);
  x = x | (x >> 2);
  x = x | (x >> 4);
  x = x | (x >> 8);
  x = x | (x >> 16);
  x = x | (x >> 32);
  return x - (x >> 1);
}