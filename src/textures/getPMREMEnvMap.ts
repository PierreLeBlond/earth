import {THREE} from '@s0rt/3d-viewer';

export default function getPMREMEnvMap(
    renderer: THREE.WebGLRenderer, hdr: THREE.Texture) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const envMap = pmremGenerator.fromEquirectangular(hdr).texture;
  pmremGenerator.dispose();
  return envMap;
}
