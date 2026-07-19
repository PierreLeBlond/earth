#define STANDARD

const float kMaxRadianceLod = 9.0;

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

uniform float occlusionFactor;

uniform samplerCube irradiance_map;
uniform samplerCube radiance_map;
uniform sampler2D brdf_map;

uniform mat4 ibl_matrix;

varying vec3 vViewPosition;

#ifdef USE_SSAO
varying vec4 vClipPosition;
#endif

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6

vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {
  // dir can be either a direction vector or a normal vector
  // upper-left 3x3 of matrix is assumed to be orthogonal
  return normalize((vec4(dir, 0.0) * matrix).xyz);
}

#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
varying vec4 vColor;
#endif

#if defined( USE_UV ) || defined( USE_ANISOTROPY )
varying vec2 vUv;
#endif

#if defined(USE_MAP) || defined(USE_TARGET_MAP)
varying vec2 vMapUv;
#endif

#ifdef USE_ALPHAMAP
varying vec2 vAlphaMapUv;
#endif

#if defined(USE_AOMAP) || defined(USE_TARGET_AOMAP)
varying vec2 vAoMapUv;
#endif

#if defined(USE_NORMALMAP) || defined(USE_TARGET_NORMALMAP)
varying vec2 vNormalMapUv;
#endif

#if defined(USE_EMISSIVEMAP) || defined(USE_TARGET_EMISSIVEMAP)
varying vec2 vEmissiveMapUv;
#endif

#if defined(USE_METALNESSMAP) || defined(USE_TARGET_METALNESSMAP)
varying vec2 vMetalnessMapUv;
#endif

#if defined(USE_ROUGHNESSMAP) || defined(USE_TARGET_ROUGHNESSMAP)
varying vec2 vRoughnessMapUv;
#endif

#ifdef USE_MAP
uniform sampler2D map;
#endif

#ifdef USE_TARGET_MAP
uniform sampler2D targetMap;
#endif

#ifdef USE_TRANSITION
uniform float ratio;
uniform vec3 sphereCenter;
uniform float sphereRadius;

uniform vec3 targetDiffuse;
uniform float targetRoughness;
uniform float targetMetalness;
uniform vec3 targetEmissive;
#endif

#ifdef USE_TARGET_NORMALMAP
uniform sampler2D targetNormalMap;
uniform vec2 targetNormalScale;
#endif

#ifdef USE_TARGET_ROUGHNESSMAP
uniform sampler2D targetRoughnessMap;
#endif

#ifdef USE_TARGET_METALNESSMAP
uniform sampler2D targetMetalnessMap;
#endif

#ifdef USE_TARGET_AOMAP
uniform sampler2D targetAoMap;
uniform float targetAoMapIntensity;
#endif

#ifdef USE_TARGET_EMISSIVEMAP
uniform sampler2D targetEmissiveMap;
#endif

#ifdef USE_ALPHAMAP
uniform sampler2D alphaMap;
#endif

#ifdef USE_ALPHATEST
uniform float alphaTest;
#endif

#ifdef USE_AOMAP
uniform sampler2D aoMap;
uniform float aoMapIntensity;
#endif

#ifdef USE_EMISSIVEMAP
uniform sampler2D emissiveMap;
#endif

#ifndef FLAT_SHADED
varying vec3 vNormal;
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif

#ifdef USE_TRIPLANAR_UV_MAPPING
varying vec3 vTriplanarUvMappingPosition;
varying vec3 vWorldNormal;
#endif

#ifdef USE_NORMALMAP
uniform sampler2D normalMap;
uniform vec2 normalScale;
#endif

#ifdef USE_NORMALMAP_OBJECTSPACE
uniform mat3 normalMatrix;
#endif

#if defined(USE_NORMALMAP) || defined(USE_TARGET_NORMALMAP)
// Normal Mapping Without Precomputed Tangents
// http://www.thetenthplanet.de/archives/1180
mat3 getTangentFrame(vec3 eye_pos, vec3 surf_norm, vec2 uv) {
  vec3 q0 = dFdx(eye_pos.xyz);
  vec3 q1 = dFdy(eye_pos.xyz);
  vec2 st0 = dFdx(uv.st);
  vec2 st1 = dFdy(uv.st);

  vec3 N = surf_norm; // normalized

  vec3 q1perp = cross(q1, N);
  vec3 q0perp = cross(N, q0);

  vec3 T = q1perp * st0.x + q0perp * st1.x;
  vec3 B = q1perp * st0.y + q0perp * st1.y;

  float det = max(dot(T, T), dot(B, B));
  float scale = (det == 0.0) ? 0.0 : inversesqrt(det);

  return mat3(T * scale, B * scale, N);
}
#endif

#ifdef USE_ROUGHNESSMAP
uniform sampler2D roughnessMap;
#endif

#ifdef USE_METALNESSMAP
uniform sampler2D metalnessMap;
#endif

#ifdef USE_REINHARD_TONEMAPPER
vec3 toneMap(vec3 hdrColor) {
  return hdrColor / (hdrColor + vec3(1.0));
}
#endif

#ifdef USE_ACES_TONEMAPPER
vec3 toneMap(vec3 hdrColor) {
  // ACES APPROXIMATION from https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
  hdrColor *= 0.6;
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  hdrColor = clamp((hdrColor * (a * hdrColor + b)) / (hdrColor * (c * hdrColor + d) + e), 0.0, 1.0);

  return hdrColor;
}
#endif

#ifdef USE_KHRONOS_PBR_NEUTRAL_TONEMAPPER
// Input color is non-negative and resides in the Linear Rec. 709 color space.
// Output color is also Linear Rec. 709, but in the [0, 1] range.
vec3 toneMap(vec3 hdrColor) {
  const float startCompression = 0.8 - 0.04;
  const float desaturation = 0.15;

  float x = min(hdrColor.r, min(hdrColor.g, hdrColor.b));
  float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
  hdrColor -= offset;

  float peak = max(hdrColor.r, max(hdrColor.g, hdrColor.b));
  if (peak < startCompression) return hdrColor;

  const float d = 1. - startCompression;
  float newPeak = 1. - d * d / (peak + d - startCompression);
  hdrColor *= newPeak / peak;

  float g = 1. - 1. / (desaturation * (peak - newPeak) + 1.);
  return mix(hdrColor, newPeak * vec3(1, 1, 1), g);
}
#endif

vec3 untoneMap(vec3 hdrColor) {
  // ACES INVERSE APPROXIMATION from https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
  // See https://www.symbolab.com/solver/function-inverse-calculator/inverse%20f%5Cleft(x%5Cright)%3D%5Cfrac%7B%5Cleft(2.51%5Ccdot%20x%5E%7B2%7D%20%2B%200.03%5Ccdot%20x%5Cright)%7D%7B2.43%5Ccdot%20x%5E%7B2%7D%20%2B0.59%5Ccdot%20x%20%2B%200.14%7D
  float a = -0.59;
  float b = 0.03;
  float c = -1.0127;
  float d = 1.3702;
  float e = 0.0009;
  float f = 2.43;
  float g = 2.51;
  hdrColor = (a * hdrColor + b - sqrt(c * hdrColor * hdrColor + d * hdrColor + e)) / (2.0 * (f * hdrColor - g));
  hdrColor /= 0.6;

  return hdrColor;
}

vec3 RGBDToHDR(vec4 rgbd) {
  return rgbd.bgr / rgbd.a;
}

#ifdef REFLECTOR
uniform sampler2D reflectorMap;
uniform sampler2D reflectorDepthMap;

uniform mat4 projectionMatrix;

uniform mat4 reflectorViewMatrix;
uniform mat4 reflectorProjectionMatrix;
uniform mat4 reflectorMatrix;
#endif

#ifdef USE_SSAO
uniform sampler2D ssaoMap;
#endif

varying vec4 world_position_out;

vec3 FresnelSchlickRoughness(float cos_theta, vec3 f_0, float roughness) {
  return f_0 + (max(vec3(1.0 - roughness), f_0) - f_0) * pow(clamp(1.0 - cos_theta, 0.0, 1.0), 5.0);
}

vec3 GetConductorMultipleScattering(float n_dot_v, float roughness, vec3 color, vec3 irradiance, vec3 radiance) {
  vec3 f_0 = color;

  // Correction at low roughness for dielectrics, from Fdez-Aguera
  vec3 k_s = FresnelSchlickRoughness(n_dot_v, f_0, roughness);

  vec4 brdf_sample = texture2D(brdf_map, vec2(n_dot_v, roughness));
  vec2 F_ab = brdf_sample.rg;
  vec3 FssEss = k_s * F_ab.x + F_ab.y;

  // Adding multiple scattering, from Fdez-Aguera
  float Ess = F_ab.x + F_ab.y;
  float Ems = 1.0 - Ess;
  vec3 Favg = f_0 + (1.0 - f_0) / 21.0;
  vec3 Fms = FssEss * Favg / (1.0 - (1.0 - Ess) * Favg);

  return FssEss * radiance + (Fms * Ems) * irradiance;
}

vec3 GetDielectricMultipleScattering(float n_dot_v, float roughness, vec3 color, vec3 irradiance, vec3 radiance) {
  vec3 f_0 = vec3(0.04);

  // Correction at low roughness for dielectrics, from Fdez-Aguera
  vec3 k_s = FresnelSchlickRoughness(n_dot_v, f_0, roughness);

  vec4 brdf_sample = texture2D(brdf_map, vec2(n_dot_v, roughness));
  vec2 F_ab = brdf_sample.rg;
  vec3 FssEss = k_s * F_ab.x + F_ab.y;

  // Adding multiple scattering, from Fdez-Aguera
  float Ess = F_ab.x + F_ab.y;
  float Ems = 1.0 - Ess;
  vec3 Favg = f_0 + (1.0 - f_0) / 21.0;
  vec3 Fms = FssEss * Favg / (1.0 - (1.0 - Ess) * Favg);

  vec3 Edss = 1.0 - (FssEss + Fms * Ems);
  vec3 k_d = color * Edss;

  return FssEss * radiance + (Fms * Ems + k_d) * irradiance;
}

float cubicBezier(vec4 controls, float t) {
  return (1.0 - t) * (1.0 - t) * (1.0 - t) * controls.x + 3.0 * t * (1.0 - t) * (1.0 - t) * controls.y + 3.0 * t * t * (1.0 - t) * controls.z + t * t * t * controls.w;
}

void main() {

  #ifdef USE_TRIPLANAR_UV_MAPPING
  vec2 xProjectedUv = abs(dot(vWorldNormal, vec3(1.0, 0.0, 0.0))) * vTriplanarUvMappingPosition.yz;
  vec2 yProjectedUv = abs(dot(vWorldNormal, vec3(0.0, 1.0, 0.0))) * vTriplanarUvMappingPosition.xz;
  vec2 zProjectedUv = abs(dot(vWorldNormal, vec3(0.0, 0.0, 1.0))) * vTriplanarUvMappingPosition.xy;
  vec2 world_uv = xProjectedUv + yProjectedUv + zProjectedUv;

  vec2 mapUv = world_uv;
  vec2 roughnessMapUv = world_uv;
  vec2 metalnessMapUv = world_uv;
  vec2 normalMapUv = world_uv;
  #else
  #if defined(USE_MAP) || defined(USE_TARGET_MAP)
  vec2 mapUv = vMapUv;
  #endif
  #if defined(USE_ROUGHNESSMAP) || defined(USE_TARGET_ROUGHNESSMAP)
  vec2 roughnessMapUv = vRoughnessMapUv;
  #endif
  #if defined(USE_METALNESSMAP) || defined(USE_TARGET_METALNESSMAP)
  vec2 metalnessMapUv = vMetalnessMapUv;
  #endif
  #if defined(USE_NORMALMAP) || defined(USE_TARGET_NORMALMAP)
  vec2 normalMapUv = vNormalMapUv;
  #endif
  #endif

  vec4 diffuseColor = vec4(pow(diffuse, vec3(2.2)), opacity);
  vec3 totalEmissiveRadiance = emissive;

  #ifdef USE_TRANSITION
  float sphereDist = length(world_position_out.xyz - sphereCenter) / max(sphereRadius, 0.001);
  float edge = 0.1;
  float front = ratio * (1.0 + 2.0 * edge) - edge;
  float ratio = 1.0 - smoothstep(front - edge, front + edge, sphereDist);

  vec4 targetDiffuseColor = vec4(pow(targetDiffuse, vec3(2.2)), opacity);

  vec3 targetTotalEmissiveRadiance = targetEmissive;
  #endif

  vec3 normal = normalize(vNormal);

  #ifdef DOUBLE_SIDED
  normal *= faceDirection;
  #endif

  #if defined(USE_NORMALMAP) || defined(USE_TARGET_NORMALMAP)
  mat3 tbn = getTangentFrame(-vViewPosition, normal, normalMapUv);

  #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
  tbn[0] *= faceDirection;
  tbn[1] *= faceDirection;
  #endif

  vec3 mapN = vec3(0.0, 0.0, 1.0);

  #ifdef USE_NORMALMAP
  mapN = texture2D(normalMap, normalMapUv).xyz * 2.0 - 1.0;
  mapN.xy *= normalScale;
  #endif

  #ifdef USE_TARGET_NORMALMAP
  vec3 targetMapN = texture2D(targetNormalMap, normalMapUv).xyz * 2.0 - 1.0;
  targetMapN.xy *= targetNormalScale;
  mapN = mix(mapN, targetMapN, ratio);
  #endif

  normal = normalize(tbn * mapN);
  #endif

  #ifdef USE_MAP
  vec4 diffuse_color_sample = texture2D(map, mapUv);
  diffuseColor *= pow(diffuse_color_sample, vec4(2.2));
  #endif

  #ifdef USE_TARGET_MAP
  vec4 target_diffuse_color_sample = texture2D(targetMap, mapUv);
  targetDiffuseColor *= pow(target_diffuse_color_sample, vec4(2.2));
  #endif

  #ifdef USE_TRANSITION
  diffuseColor = mix(diffuseColor, targetDiffuseColor, ratio);
  #endif

  #ifdef USE_ALPHAMAP
  diffuseColor.a *= texture2D(alphaMap, vAlphaMapUv).g;
  #endif

  #ifdef USE_ALPHATEST
  #ifdef ALPHA_TO_COVERAGE
  diffuseColor.a = smoothstep(alphaTest, alphaTest + fwidth(diffuseColor.a), diffuseColor.a);
  if (diffuseColor.a == 0.0) discard;
  #else
  if (diffuseColor.a < alphaTest) discard;
  #endif
  #endif

  float roughnessFactor = roughness;
  #ifdef USE_ROUGHNESSMAP
  vec4 texelRoughness = texture2D(roughnessMap, roughnessMapUv);
  // reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
  roughnessFactor *= texelRoughness.g;
  #endif

  #ifdef USE_TRANSITION
  float targetRoughnessFactor = targetRoughness;
  #ifdef USE_TARGET_ROUGHNESSMAP
  vec4 texelTargetRoughness = texture2D(targetRoughnessMap, roughnessMapUv);
  targetRoughnessFactor *= texelTargetRoughness.g;
  #endif

  roughnessFactor = mix(roughnessFactor, targetRoughnessFactor, ratio);
  #endif

  float metalnessFactor = metalness;
  #ifdef USE_METALNESSMAP
  vec4 texelMetalness = texture2D(metalnessMap, metalnessMapUv);
  // reads channel B, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
  metalnessFactor *= texelMetalness.b;
  #endif

  #ifdef USE_TRANSITION
  float targetMetalnessFactor = targetMetalness;
  #ifdef USE_TARGET_METALNESSMAP
  vec4 texelTargetMetalness = texture2D(targetMetalnessMap, metalnessMapUv);
  targetMetalnessFactor *= texelTargetMetalness.b;
  #endif

  metalnessFactor = mix(metalnessFactor, targetMetalnessFactor, ratio);
  #endif

  float faceDirection = gl_FrontFacing ? 1.0 : -1.0;

  #ifdef USE_EMISSIVEMAP
  vec4 emissiveColor = texture2D(emissiveMap, vEmissiveMapUv);
  totalEmissiveRadiance *= emissiveColor.rgb;
  #endif

  #ifdef USE_TARGET_EMISSIVEMAP
  vec4 targetEmissiveColor = texture2D(targetEmissiveMap, vEmissiveMapUv);
  targetTotalEmissiveRadiance *= targetEmissiveColor.rgb;
  #endif

  #ifdef USE_TRANSITION
  totalEmissiveRadiance = mix(totalEmissiveRadiance, targetTotalEmissiveRadiance, ratio);
  #endif

  vec3 occlusion = vec3(1.0);
  #ifdef USE_AOMAP
  // One of many hacks, we assume that lightmaps have been tonemapped from and hdr bake, and we then clamp any hdr value greater than 1
  vec3 occlusionSample = clamp(vec3(texture2D(aoMap, vAoMapUv).r), 0.0, 1.0);
  occlusion = (occlusionSample - 1.0) * aoMapIntensity + 1.0;
  #ifdef USE_TARGET_AOMAP
  vec3 targetOcclusionSample = clamp(vec3(texture2D(targetAoMap, vAoMapUv).r), 0.0, 1.0);
  vec3 targetOcclusion = (targetOcclusionSample - 1.0) * aoMapIntensity + 1.0;
  occlusion = mix(occlusion, targetOcclusion, ratio);
  #endif
  #endif

  #ifdef USE_SSAO
  vec2 screenUv = (vClipPosition.xy / vClipPosition.w) * 0.5 + 0.5;
  vec3 ssao = texture(ssaoMap, screenUv).rgb;
  occlusion = min(occlusion, ssao);
  #endif

  vec3 radiance = vec3(0.0);
  vec3 irradiance = vec3(0.0);
  vec3 ambient = vec3(0.0);

  #ifdef IBL
  vec3 world_normal = inverseTransformDirection(normal, viewMatrix);
  vec3 view_vector = normalize(cameraPosition - world_position_out.xyz);

  float n_dot_v = max(dot(world_normal, view_vector), 0.0);

  #ifdef IBL_IN_VIEW_SPACE
  vec3 irradiance_normal = vec3(ibl_matrix * vec4(normal, 0.0));
  #else
  vec3 irradiance_normal = vec3(ibl_matrix * vec4(world_normal, 0.0));
  #endif
  irradiance = textureCube(irradiance_map, irradiance_normal).rgb;
  // We apply occlusion to irradiance with an artistic factor
  irradiance *= pow(occlusion, vec3(occlusionFactor));

  float lowerLevel = floor(roughnessFactor * kMaxRadianceLod);
  float upperLevel = ceil(roughnessFactor * kMaxRadianceLod);

  vec3 reflection_vector = reflect(-view_vector, world_normal);
  // Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
  reflection_vector = normalize(mix(reflection_vector, world_normal, roughnessFactor * roughnessFactor));
  reflection_vector = vec3(ibl_matrix * vec4(reflection_vector, 0.0));
  #ifdef IBL_IN_VIEW_SPACE
  reflection_vector = vec3(viewMatrix * vec4(reflection_vector, 0.0));
  #endif

  radiance = textureCubeLodEXT(radiance_map, reflection_vector, roughnessFactor * kMaxRadianceLod).rgb;
  // We add another artistic factor specifically for radiance, as a fake specular occlusion, with a smooth transition from no reflection to full reflection
  vec3 radianceOcclusion = pow(vec3(smoothstep(0.6, 0.9, occlusion.r)), vec3(occlusionFactor));
  radiance *= radianceOcclusion;

  #ifdef REFLECTOR
  vec4 positionClip = projectionMatrix * viewMatrix * world_position_out;
  vec3 positionNDC = positionClip.xyz / positionClip.w;
  vec2 uv = positionNDC.xy * 0.5 + 0.5;

  vec4 reflectorNormal = reflectorMatrix * vec4(0.0, 0.0, 1.0, 0.0);
  float orientationFactor = step(0.0, dot(reflectorNormal.xyz, normal));

  float reflectorDepth = texture2D(reflectorDepthMap, uv).x;

  vec4 reflectorTexel = texture2D(reflectorMap, uv);

  reflectorTexel.rgb = pow(reflectorTexel.rgb, vec3(2.2));
  reflectorTexel.rgb = untoneMap(reflectorTexel.rgb);

  radiance = mix(radiance, reflectorTexel.rgb, orientationFactor * (1.0 - step(1.0, reflectorDepth)));
  #endif

  ambient = mix(GetDielectricMultipleScattering(n_dot_v, roughnessFactor, diffuseColor.rgb, irradiance, radiance),
      GetConductorMultipleScattering(n_dot_v, roughnessFactor, diffuseColor.rgb, irradiance, radiance), metalnessFactor);

  #endif

  vec3 outgoingLight = ambient;

  #ifdef OPAQUE
  diffuseColor.a = 1.0;
  #endif

  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
  gl_FragColor.xyz = toneMap(gl_FragColor.xyz);

  // We assume emissive component is already tonemapped.
  // TODO: Could be better to use a emissive only material, as combining emissive with other pbr component does not make much senses.
  gl_FragColor.xyz += totalEmissiveRadiance;

  gl_FragColor.xyz = pow(gl_FragColor.xyz, vec3(1.0 / 2.2));

  #ifdef PREMULTIPLIED_ALPHA
  // Get normal blending with premultipled, use with CustomBlending, OneFactor, OneMinusSrcAlphaFactor, AddEquation.
  gl_FragColor.rgb *= gl_FragColor.a;
  #endif

  #ifdef OUTPUT_OVERRIDE
  gl_FragColor.xyz = OUTPUT_OVERRIDE;
  #endif
}
