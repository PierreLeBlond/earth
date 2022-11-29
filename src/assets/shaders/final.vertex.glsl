varying vec2 uv_out;

void main(){
  uv_out = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}

