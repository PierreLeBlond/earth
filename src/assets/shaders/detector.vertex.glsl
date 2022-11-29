varying vec2 uv_out;
varying vec3 pos_out;
varying vec3 normal_out;

void main(){
  uv_out = uv;
  pos_out = (modelMatrix * vec4(position, 1.0)).xyz;
  normal_out = (modelMatrix * vec4(normal, 0.0)).xyz;
  gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0);
}

