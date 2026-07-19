import { Mesh, Scene, ShaderMaterial, SphereGeometry, Uniform, WebGLRenderTarget } from 'three';
import fragmentShader from '../assets/shaders/detector.fragment.glsl';
import vertexShader from '../assets/shaders/detector.vertex.glsl';
import { createScene } from '@3dvf/create-scene/create-scene';

const sceneName = "detector-scene";

export function getDetectorScene(defaultScene: Scene, width: number, height: number): Scene {
  let scene = defaultScene.userData[sceneName];

  if (scene) {
    return scene;
  }

  const uniforms: { [key: string]: Uniform } = { map: new Uniform(null) };
  const material = new ShaderMaterial(
    { uniforms, vertexShader, fragmentShader });
  const geometry = new SphereGeometry(1, 32, 32);
  const mesh = new Mesh(geometry, material);
  mesh.name = 'detector';

  scene = createScene(sceneName);
  scene.add(mesh);

  const renderTarget = new WebGLRenderTarget(width, height);
  scene.userData['renderTarget'] = renderTarget;

  defaultScene.userData[sceneName] = scene;
  return scene;
}
