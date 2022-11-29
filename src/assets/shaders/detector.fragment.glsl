uniform sampler2D map;

varying vec2 uv_out;

void main(){
  vec3 color = texture2D(map, uv_out).rgb;
  gl_FragColor = vec4(color, 1.0);
}

