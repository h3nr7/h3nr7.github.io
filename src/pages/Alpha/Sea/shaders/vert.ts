import { createShaderProgram, glsl } from "typed-glsl";
import * as THREE from 'three'
import { perlin3d } from './perlin3d'

export const vert = glsl`

  /*${THREE.ShaderChunk.common}*/
  
  uniform float seaHeight;
  uniform float seaSpeed;
  uniform vec2 seaFrequency;
  uniform float seaNoiseFactor;
  uniform float seaWaveAmplitude;
  uniform float uTime;
  varying float vElevation;
  varying vec2 vUv;
  uniform sampler2D colorMap;

  ${perlin3d}


  void main() {

    // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // float elevation = sin(modelPosition.x * seaFrequency.x + uTime * seaSpeed) *
    //                   sin(modelPosition.y * seaFrequency.y + uTime * seaSpeed) *
    //                   seaHeight;

    // elevation += cnoise(vec3(modelPosition.xz, uTime * seaNoiseFactor));

    // modelPosition.y += elevation;

    // vec4 viewPosition = viewMatrix * modelPosition;
    // vec4 projectedPosition = projectionMatrix * viewPosition;


    
    // gl_Position = projectedPosition;

    // vElevation = elevation;

    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float colorMapAlpha = texture2D(colorMap, vUv).a;

    // large waves according to normal vector
    float mainElevations = sin(modelPosition.x * seaFrequency.x + uTime * seaSpeed) *
                           sin(modelPosition.y * seaFrequency.y + uTime * seaSpeed) *
                           sin(modelPosition.z + uTime * seaSpeed) *
                           seaHeight;

    // smaller waves according to position
    // float smallElevations = abs(uTime * cnoise(vec3(
    //                           0.01 * seaNoiseFactor * length(normal.xz),
    //                           0.01 * seaNoiseFactor * length(normal.yz),
    //                           0.01 * seaNoiseFactor * length(normal.xy)
    //                         )) * 0.15);

    float smallElevations = abs(turbulence(0.1 * seaNoiseFactor * normal * uTime)) * 0.05 * seaWaveAmplitude;

    float elevation = mainElevations + smallElevations;


    if(colorMapAlpha == 0.0) {
      modelPosition -= elevation;
    }


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;



    gl_Position = projectedPosition;

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(normal, 1.0);

    vElevation = elevation;
  }

`