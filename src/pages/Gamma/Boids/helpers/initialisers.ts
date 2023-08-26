import { Texture } from "three";
import { BOUNDS, BOUNDS_HALF } from "..";


/**
 * fill position texture
 * @param texture 
 */
export function fillPositionTexture(texture:Texture, bounds:number = BOUNDS) {
  const theArray = texture.image.data;

  for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {

    const x = Math.random() * BOUNDS - BOUNDS_HALF;
    const y = Math.random() * BOUNDS - BOUNDS_HALF;
    const z = Math.random() * BOUNDS - BOUNDS_HALF;

    theArray[ k + 0 ] = x;
    theArray[ k + 1 ] = y;
    theArray[ k + 2 ] = z;
    theArray[ k + 3 ] = 1;
  }
}


/**
 * fill velocity texture
 * @param texture 
 */
export function fillVelocityTexture(texture:Texture) {
  const theArray = texture.image.data;

  for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {

    const x = Math.random() - 0.5;
    const y = Math.random() - 0.5;
    const z = Math.random() - 0.5;

    theArray[ k + 0 ] = x * 10;
    theArray[ k + 1 ] = y * 10;
    theArray[ k + 2 ] = z * 10;
    theArray[ k + 3 ] = 1;

  }
}