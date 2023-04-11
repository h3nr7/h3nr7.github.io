import { createShaderProgram, glsl } from "typed-glsl";
import * as THREE from 'three'
import { perlin3d } from './perlin3d'

export const vert = glsl`

  /*${THREE.ShaderChunk.common}*/
  
  uniform float seaHeight;
  uniform float seaSpeed;
  uniform vec2 seaFrequency;
  uniform float seaNoiseDamper;
  uniform float uTime;
  varying float vElevation;

  ${perlin3d}
  
  void main() {

    // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // float elevation = sin(modelPosition.x * seaFrequency.x + uTime * seaSpeed) *
    //                   sin(modelPosition.y * seaFrequency.y + uTime * seaSpeed) *
    //                   seaHeight;

    // elevation += cnoise(vec3(modelPosition.xz, uTime * seaNoiseDamper));

    // modelPosition.y += elevation;

    // vec4 viewPosition = viewMatrix * modelPosition;
    // vec4 projectedPosition = projectionMatrix * viewPosition;


    
    // gl_Position = projectedPosition;

    // vElevation = elevation;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float elevation = sin(normal.x * seaFrequency.x + uTime * seaSpeed) *
                      sin(normal.y * seaFrequency.y + uTime * seaSpeed) *
                      sin(normal.z + uTime * seaSpeed) *
                      seaHeight;

    elevation += cnoise(vec3(modelPosition.xy + normal.xz, uTime * seaNoiseDamper));

    // elevation += uTime * seaNoiseDamper * cnoise(vec3(normal.xyz));

    modelPosition.x += elevation;
    modelPosition.y += elevation;
    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;



    gl_Position = projectedPosition;

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(normal, 1.0);

    vElevation = elevation;
  }

`