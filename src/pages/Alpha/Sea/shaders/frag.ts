import { createShaderProgram, glsl } from "typed-glsl";

export const frag = glsl`

uniform vec3 seaTroughColor;
uniform vec3 seaCrestColor;
uniform vec2 seaFrequency;
uniform float seaWaveFactor;
uniform float seaWaveColorOffset;
varying float vElevation;

void main() {

  float waveStrength = (vElevation * seaWaveColorOffset) * seaWaveFactor;
  vec3 color = mix(seaTroughColor, seaCrestColor, waveStrength);
  gl_FragColor = vec4(color, 1.0);
}
`