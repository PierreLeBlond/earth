import { THREE, Scene } from '@s0rt/3d-viewer';

export function getEarthMesh(scene: Scene) {
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  const material = scene.createMaterial();
  material.color = new THREE.Color(1, 1, 1);

  material.roughness = 1;
  material.metalness = 1;

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'earth';

  return mesh;
}

