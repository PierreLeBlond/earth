import { Scene, THREE, Viewer } from '@s0rt/3d-viewer';
import fragmentShader from '../assets/shaders/detector.fragment.glsl';
import vertexShader from '../assets/shaders/detector.vertex.glsl';

export function getDetectorScene(viewer: Viewer, width: number, height: number): Scene {
  const uniforms: { [key: string]: THREE.Uniform } = { map: { type: 't', value: null, dynamic: false, onUpdate: null } };
  const material = new THREE.ShaderMaterial(
    { uniforms, vertexShader, fragmentShader });
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'detector';

  const scene = viewer.createScene('earth-detector');
  scene.add(mesh);

  const renderTarget = new viewer.context.WebGLRenderTarget(width, height);
  scene.userData.renderTarget = renderTarget;

  return scene;
}
