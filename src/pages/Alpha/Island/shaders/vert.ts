import { createShaderProgram, glsl } from "typed-glsl";
import * as THREE from 'three'
// varying vec3 vColor;
// uniform vec3 color1;
// uniform vec3 color2;

// void main() {
//   vColor = mix( color1, color2, texture2D( displacementMap, uv ).x );
// }

export const vert = glsl`

  ${THREE.ShaderChunk.common}

  // varying vec2 vUv;
  // void main() {
  //   vUv = uv;
  //   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  // }
  // uniform sampler2D displacementMap;
  // varying vec3 vColor;
  // uniform vec3 color1;
  // uniform vec3 color2;

  // void main() {
  //   vColor = mix( color1, color2, texture2D( displacementMap, uv ).x );
  // }

  varying vec2 vUv;
  uniform sampler2D displacementMap;
  uniform float displacementScale;
  
  void main() {

    vUv = uv;
    vec4 tex = texture2D(displacementMap, vUv);
    vec3 nPos = position + normal * tex.r * displacementScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( nPos, 1.0 );

  }

`