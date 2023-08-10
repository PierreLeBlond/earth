import { Scene, THREE, Viewer } from '@s0rt/3d-viewer';
import { getEarthMesh } from './meshes/getEarthMesh';

export function getEarthScene(viewer: Viewer, width: number, height: number): Scene {
  const scene = viewer.createScene('earth-main');

  const earthMesh = getEarthMesh(scene);

  const light = new THREE.AmbientLight();
  scene.add(light);
  scene.add(earthMesh);

  const renderTarget = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat
  });
  scene.userData['renderTarget'] = renderTarget;

  return scene;
}

