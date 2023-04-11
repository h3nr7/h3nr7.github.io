import { createShaderProgram, glsl } from "typed-glsl";

export const frag = glsl`

  // uniform float time;
  // uniform vec3 color;
  // varying vec2 vUv;
  // void main() {
  //   gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) + color, 1.0);
  // }
  
  // uniform vec3 outgoingLight;
  // uniform vec4 diffuseColor;
  // varying vec3 vColor;

  // void main() {
  //   gl_FragColor = vec4( outgoingLight, diffuseColor.a );
  //   gl_FragColor.rgb = vColor;
  // }

  varying vec2 vUv;
  uniform float fragColorRatio;
  uniform sampler2D colorMap;
  uniform sampler2D displacementMap;

  void main() {
    vec4 colorTex = texture2D(colorMap, vUv);
    vec4 disTex = texture2D(displacementMap, vUv);

    vec4 tex = colorTex * fragColorRatio + disTex * (1.0 - fragColorRatio);
    gl_FragColor = vec4(tex.rgb, texture2D(colorMap, vUv).a);
  }
`