import createMaterial from "@3dvf/create-material/create-material";
import { Color, Mesh, Scene, SphereGeometry } from "three";

export function getEarthMesh(scene: Scene) {
  const geometry = new SphereGeometry(1, 64, 64);

  const material = createMaterial(scene);
  material.color = new Color(1, 1, 1);

  material.roughness = 1;
  material.metalness = 1;

  const mesh = new Mesh(geometry, material);
  mesh.name = 'earth';

  return mesh;
}

