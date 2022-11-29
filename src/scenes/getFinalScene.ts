import { THREE, Viewer } from '@s0rt/3d-viewer';
import fragmentShader from '../assets/shaders/final.fragment.glsl';
import vertexShader from '../assets/shaders/final.vertex.glsl';

export function getFinalScene(viewer: Viewer): THREE.Scene {
  const scene = viewer.createScene('earth-final');
  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms: { [name: string]: any } = {
    map: { type: 't', value: null },
    index_map: { type: 't', value: null },
    picked_index: { type: 'i', value: 666 },
  };

  const material = new THREE.ShaderMaterial(
    { uniforms, vertexShader, fragmentShader });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'final';

  scene.add(mesh);

  return scene;
}

