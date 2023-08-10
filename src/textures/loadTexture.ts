import { THREE } from '@s0rt/3d-viewer';

export default async function loadTexture(
  _: THREE.WebGLRenderer, path: string) {
  const loader = new THREE.TextureLoader();
  const envMap = await loader.loadAsync(path);
  return envMap;
};
