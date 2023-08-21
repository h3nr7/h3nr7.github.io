import { glsl } from "typed-glsl";

export const frag = glsl`

uniform vec3 seaTroughColor;
uniform vec3 seaCrestColor;
uniform vec2 seaFrequency;
uniform float seaWaveFactor;
uniform float seaWaveColorOffset;
varying float vElevation;
uniform sampler2D colorMap;
varying vec2 vUv;

void main() {

  float waveStrength = (vElevation * seaWaveColorOffset) * seaWaveFactor;
  vec3 color = mix(seaTroughColor, seaCrestColor, waveStrength);

  // float colorMapAlpha = texture2D(colorMap, vUv).a;

  gl_FragColor = vec4(color, 1.0);
}
`