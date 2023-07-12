import { createShaderProgram, glsl } from "typed-glsl";

export const frag = glsl`

  varying vec2 vUv;
  uniform float fragColorRatio;
  uniform sampler2D colorMap;
  uniform sampler2D displacementMap;

  void main() {

    vec4 colorTex = texture2D(colorMap, vUv);
    vec4 disTex = texture2D(displacementMap, vUv);

    vec4 tex = colorTex * fragColorRatio + disTex * (1.0 - fragColorRatio);
    
    float colorMapAlpha = texture2D(colorMap, vUv).a;

    gl_FragColor = vec4(tex.rgb, colorMapAlpha);

  }
`