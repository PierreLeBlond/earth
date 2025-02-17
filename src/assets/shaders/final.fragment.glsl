uniform sampler2D map;
uniform sampler2D index_map;
uniform int picked_index;

varying vec2 uv_out;

#include <common>
/*vec3 toneMap(vec3 hdrColor) {
  return hdrColor/(hdrColor + vec3(1.0));
}

vec3 untoneMap(vec3 ldrColor) {
  return ldrColor/(vec3(1.0) - ldrColor);
}*/

vec3 toneMap(vec3 hdrColor) {
 // ACES APPROXIMATION from https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
  hdrColor *= 0.6;
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  hdrColor = clamp((hdrColor*(a*hdrColor+b))/(hdrColor*(c*hdrColor+d)+e), 0.0, 1.0);

  return hdrColor;
}

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
hdrColor = (a*hdrColor + b - sqrt(c*hdrColor*hdrColor + d*hdrColor + e))/(2.0*(f*hdrColor - g));
hdrColor /= 0.6;

return hdrColor;
}

void main(){
  vec4 color = texture2D(map, uv_out);
  color.xyz = pow(color.xyz, vec3(2.2));
  color.xyz = untoneMap(color.xyz);

  vec4 index_color = texture2D(index_map, uv_out);

  if (int(index_color*255.0) == picked_index) {
    gl_FragColor = vec4(2.0, 2.0, 2.0, 1.0);
  } else {
    gl_FragColor = color;
  }

  gl_FragColor.xyz = toneMap(gl_FragColor.xyz);
  gl_FragColor.xyz = pow(gl_FragColor.xyz, vec3(1.0/2.2));
}
