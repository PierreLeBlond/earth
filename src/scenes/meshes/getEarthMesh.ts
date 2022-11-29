import { Viewer, THREE } from '@s0rt/3d-viewer';

export function getEarthMesh(viewer: Viewer) {
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  const material = viewer.createMaterial();
  material.color = new THREE.Color(1, 1, 1);

  material.roughness = 1;
  material.metalness = 1;

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'earth';

  return mesh;
}

