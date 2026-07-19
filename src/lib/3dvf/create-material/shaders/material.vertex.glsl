#define STANDARD
varying vec3 vViewPosition;

#ifdef USE_SSAO
varying vec4 vClipPosition;
#endif

varying vec4 world_position_out;
varying vec3 world_normal_out;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6

#ifdef USE_UV
varying vec2 vUv;
#endif
#if defined(USE_MAP) || defined(USE_TARGET_MAP)
uniform mat3 mapTransform;
varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
uniform mat3 alphaMapTransform;
varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
uniform mat3 lightMapTransform;
varying vec2 vLightMapUv;
#endif
#if defined(USE_AOMAP) || defined(USE_TARGET_AOMAP)
uniform mat3 aoMapTransform;
varying vec2 vAoMapUv;
#endif
#if defined(USE_NORMALMAP) || defined(USE_TARGET_NORMALMAP)
uniform mat3 normalMapTransform;
varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
uniform mat3 displacementMapTransform;
varying vec2 vDisplacementMapUv;
#endif
#if defined(USE_EMISSIVEMAP) || defined(USE_TARGET_EMISSIVEMAP)
uniform mat3 emissiveMapTransform;
varying vec2 vEmissiveMapUv;
#endif
#if defined(USE_METALNESSMAP) || defined(USE_TARGET_METALNESSMAP)
uniform mat3 metalnessMapTransform;
varying vec2 vMetalnessMapUv;
#endif
#if defined(USE_ROUGHNESSMAP) || defined(USE_TARGET_ROUGHNESSMAP)
uniform mat3 roughnessMapTransform;
varying vec2 vRoughnessMapUv;
#endif

varying vec3 vNormal;
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif

#ifdef USE_TRIPLANAR_UV_MAPPING
varying vec3 vTriplanarUvMappingPosition;
varying vec3 vWorldNormal;
#endif

#ifdef USE_SKINNING
uniform mat4 bindMatrix;
uniform mat4 bindMatrixInverse;
uniform highp sampler2D boneTexture;
mat4 getBoneMatrix(const in float i) {
  int size = textureSize(boneTexture, 0).x;
  int j = int(i) * 4;
  int x = j % size;
  int y = j / size;
  vec4 v1 = texelFetch(boneTexture, ivec2(x, y), 0);
  vec4 v2 = texelFetch(boneTexture, ivec2(x + 1, y), 0);
  vec4 v3 = texelFetch(boneTexture, ivec2(x + 2, y), 0);
  vec4 v4 = texelFetch(boneTexture, ivec2(x + 3, y), 0);
  return mat4(v1, v2, v3, v4);
}
#endif

#ifdef REFLECTOR
uniform mat4 reflectorViewMatrix;
uniform mat4 reflectorProjectionMatrix;
#endif

void main() {

  #ifdef USE_UV
  vUv = vec3(uv, 1).xy;
  #endif
  #if defined(USE_MAP) || defined(USE_TARGET_MAP)
  vMapUv = (mapTransform * vec3(MAP_UV, 1)).xy;
  #endif
  #ifdef USE_ALPHAMAP
  vAlphaMapUv = (alphaMapTransform * vec3(ALPHAMAP_UV, 1)).xy;
  #endif
  #ifdef USE_LIGHTMAP
  vLightMapUv = (lightMapTransform * vec3(LIGHTMAP_UV, 1)).xy;
  #endif
  #if defined(USE_AOMAP) || defined(USE_TARGET_AOMAP)
  vAoMapUv = (aoMapTransform * vec3(AOMAP_UV, 1)).xy;
  #endif
  #if defined(USE_NORMALMAP) || defined(USE_TARGET_NORMALMAP)
  vNormalMapUv = (normalMapTransform * vec3(NORMALMAP_UV, 1)).xy;
  #endif
  #ifdef USE_DISPLACEMENTMAP
  vDisplacementMapUv = (displacementMapTransform * vec3(DISPLACEMENTMAP_UV, 1)).xy;
  #endif
  #if defined(USE_EMISSIVEMAP) || defined(USE_TARGET_EMISSIVEMAP)
  vEmissiveMapUv = (emissiveMapTransform * vec3(EMISSIVEMAP_UV, 1)).xy;
  #endif
  #if defined(USE_METALNESSMAP) || defined(USE_TARGET_METALNESSMAP)
  vMetalnessMapUv = (metalnessMapTransform * vec3(METALNESSMAP_UV, 1)).xy;
  #endif
  #if defined(USE_ROUGHNESSMAP) || defined(USE_TARGET_ROUGHNESSMAP)
  vRoughnessMapUv = (roughnessMapTransform * vec3(ROUGHNESSMAP_UV, 1)).xy;
  #endif

  #ifdef USE_TRIPLANAR_UV_MAPPING
  vWorldNormal = normal;
  #endif

  vec3 objectNormal = vec3(normal);
  #ifdef USE_TANGENT
  vec3 objectTangent = vec3(tangent.xyz);
  #endif

  #ifdef USE_SKINNING
  mat4 boneMatX = getBoneMatrix(skinIndex.x);
  mat4 boneMatY = getBoneMatrix(skinIndex.y);
  mat4 boneMatZ = getBoneMatrix(skinIndex.z);
  mat4 boneMatW = getBoneMatrix(skinIndex.w);
  #endif

  #ifdef USE_SKINNING
  mat4 skinMatrix = mat4(0.0);
  skinMatrix += skinWeight.x * boneMatX;
  skinMatrix += skinWeight.y * boneMatY;
  skinMatrix += skinWeight.z * boneMatZ;
  skinMatrix += skinWeight.w * boneMatW;
  skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
  objectNormal = vec4(skinMatrix * vec4(objectNormal, 0.0)).xyz;
  #ifdef USE_TANGENT
  objectTangent = vec4(skinMatrix * vec4(objectTangent, 0.0)).xyz;
  #endif
  #endif

  vec3 transformedNormal = objectNormal;
  #ifdef USE_TANGENT
  vec3 transformedTangent = objectTangent;
  #endif

  #ifdef USE_BATCHING
  // this is in lieu of a per-instance normal-matrix
  // shear transforms in the instance matrix are not supported
  mat3 bm = mat3(batchingMatrix);
  transformedNormal /= vec3(dot(bm[0], bm[0]), dot(bm[1], bm[1]), dot(bm[2], bm[2]));
  transformedNormal = bm * transformedNormal;
  #ifdef USE_TANGENT
  transformedTangent = bm * transformedTangent;
  #endif
  #endif

  #ifdef USE_INSTANCING
  // this is in lieu of a per-instance normal-matrix
  // shear transforms in the instance matrix are not supported
  mat3 im = mat3(instanceMatrix);
  transformedNormal /= vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2]));
  transformedNormal = im * transformedNormal;
  #ifdef USE_TANGENT
  transformedTangent = im * transformedTangent;
  #endif
  #endif

  transformedNormal = normalMatrix * transformedNormal;

  #ifdef FLIP_SIDED
  transformedNormal = -transformedNormal;
  #endif

  #ifdef USE_TANGENT
  transformedTangent = (modelViewMatrix * vec4(transformedTangent, 0.0)).xyz;
  #ifdef FLIP_SIDED
  transformedTangent = -transformedTangent;
  #endif
  #endif

  vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
  vTangent = normalize(transformedTangent);
  vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif

  world_position_out = modelMatrix * vec4(position, 1.0);

  #ifdef USE_TRIPLANAR_UV_MAPPING
  vTriplanarUvMappingPosition = position + vec3(modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)) * 0.5;
  #endif

  vec3 transformed = vec3(position);

  #ifdef USE_SKINNING
  vec4 skinVertex = bindMatrix * vec4(transformed, 1.0);

  vec4 skinned = vec4(0.0);
  skinned += boneMatX * skinVertex * skinWeight.x;
  skinned += boneMatY * skinVertex * skinWeight.y;
  skinned += boneMatZ * skinVertex * skinWeight.z;
  skinned += boneMatW * skinVertex * skinWeight.w;

  transformed = (bindMatrixInverse * skinned).xyz;
  #endif

  vec4 mvPosition = vec4(transformed, 1.0);

  #ifdef USE_BATCHING
  mvPosition = batchingMatrix * mvPosition;
  #endif

  #ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
  #endif

  mvPosition = modelViewMatrix * mvPosition;

  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;

  #ifdef USE_SSAO
  vClipPosition = gl_Position;
  #endif
}
