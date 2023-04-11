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

    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // color map from the island png, so the sea would be static under the island
    float colorMapAlpha = texture2D(colorMap, vUv).a;

    // large waves according to normal vector
    float mainElevations = sin(modelPosition.x * seaFrequency.x + uTime * seaSpeed) *
                           sin(modelPosition.y * seaFrequency.y + uTime * seaSpeed) *
                           sin(modelPosition.z + uTime * seaSpeed) *
                           seaHeight;

    // smaller waves according to position
    float smallElevations = abs(turbulence(0.1 * seaNoiseFactor * normal * uTime)) * 0.05 * seaWaveAmplitude;

    // adding the large wave and small waves
    float elevation = mainElevations + smallElevations;

    if(colorMapAlpha == 0.0) {
      modelPosition -= elevation;
    }

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // out gl position
    gl_Position = projectedPosition;
    // pass elevation to fragment shader
    vElevation = elevation;
  }

`