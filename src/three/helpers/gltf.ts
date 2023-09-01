import { BufferGeometry, Group, Line, Material, Mesh, Object3D, Points, Sprite } from "three";


export type GeoMatObj = Mesh | Points | Sprite | Line

export function findObjWithGeoMat(group: any[]):GeoMatObj {
  return group.find(o => {
    if(
      (
        o instanceof Mesh || 
        o instanceof Points ||
        o instanceof Sprite ||
        o instanceof Line
      ) && 
      o.geometry && o.geometry.isBufferGeometry && 
      o.material && o.material.isMaterial
    ) {
      console.log('final found: ', o)
      return o
    } else if(o instanceof Object3D && o.children.length > 0) {
      console.log('chidren returned: ', o)
      return findObjWithGeoMat(o.children)
    } else {
      throw new Error('no valid mesh with this Object Group')
    }
  })
}

/**
 * get deeply embedded mesh
 * @param mesh 
 * @returns 
 */
function getMeshWithMaterial(mesh:Object3D) {
  if(
    mesh instanceof Mesh && 
    mesh.isMesh && 
    mesh.geometry instanceof BufferGeometry && 
    mesh.geometry.isBufferGeometry &&
    mesh.material instanceof Material &&
    mesh.material.isMaterial
  ) {
    return mesh
  } else if(mesh.children.length > 0) {
    return getMeshWithMaterial(mesh.children[0])
  } else {
    throw new Error('no valid mesh with geometry ');
  }
}