import { AmbientLight, NearestFilter, RGBAFormat, Scene, WebGLRenderTarget } from 'three';
import { getEarthMesh } from './meshes/getEarthMesh';
import { createScene } from '@3dvf/create-scene/create-scene';

const sceneName = "main-scene";

export function getEarthScene(defaultScene: Scene, width: number, height: number): Scene {
  let scene = defaultScene.userData[sceneName];

  if (scene) {
    return scene;
  }

  scene = createScene(sceneName);

  const earthMesh = getEarthMesh(scene);

  const light = new AmbientLight();
  scene.add(light);
  scene.add(earthMesh);

  const renderTarget = new WebGLRenderTarget(width, height, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat
  });
  scene.userData['renderTarget'] = renderTarget;

  defaultScene.userData[sceneName] = scene;
  return scene;
}

