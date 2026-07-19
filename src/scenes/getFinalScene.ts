import { Mesh, PlaneGeometry, Scene, ShaderMaterial } from 'three';
import fragmentShader from '../assets/shaders/final.fragment.glsl';
import vertexShader from '../assets/shaders/final.vertex.glsl';
import { createScene } from '@3dvf/create-scene/create-scene';

const sceneName = "final-scene";

export function getFinalScene(defaultScene: Scene): Scene {
  let scene = defaultScene.userData[sceneName];

  if (scene) {
    return scene;
  }

  scene = createScene(sceneName);

  const geometry = new PlaneGeometry(2, 2);

  const uniforms: { [name: string]: any } = {
    map: { type: 't', value: null },
    index_map: { type: 't', value: null },
    picked_index: { type: 'i', value: 666 },
  };

  const material = new ShaderMaterial(
    { uniforms, vertexShader, fragmentShader });

  const mesh = new Mesh(geometry, material);
  mesh.name = 'final';

  scene.add(mesh);

  defaultScene.userData[sceneName] = scene;
  return scene;
}

