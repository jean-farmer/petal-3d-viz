uniform float uTime;
uniform float uBass;
uniform float uMids;
uniform float uHighs;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uFresnelPower;
uniform float uFresnelIntensity;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vDisplacement;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), uFresnelPower);

  float t = fresnel + sin(uTime * 0.5) * 0.1;
  vec3 baseColor = mix(uColor1, uColor2, smoothstep(0.0, 0.6, t));
  baseColor = mix(baseColor, uColor3, smoothstep(0.4, 1.0, t));

  float shimmer = fresnel * uFresnelIntensity * (0.5 + uHighs * 1.5);
  vec3 shimmerColor = uColor3 * shimmer;

  float glow = smoothstep(0.0, 0.5, abs(vDisplacement)) * uBass * 0.3;
  vec3 glowColor = mix(uColor2, uColor3, 0.5) * glow;

  float midPulse = uMids * 0.08 * (0.5 + 0.5 * sin(vWorldPosition.y * 6.0 + uTime * 1.5));

  vec3 finalColor = baseColor + shimmerColor + glowColor + midPulse;

  gl_FragColor = vec4(finalColor, 1.0);
}
