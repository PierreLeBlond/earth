import type { Material } from "@3dvf/create-material/material";
import type { AnimationClip, Mesh, Object3D } from "three";

export function assertIsMesh(value: any): asserts value is Mesh {
  if (value?.type !== 'Mesh') {
    throw Error('value is not a mesh')
  }
}

export function getAllChildMesh(object: Object3D): Mesh[] {
  const meshes: Mesh[] = [];
  object.traverse((child: Object3D) => {
    if (child.type !== 'Mesh') {
      return
    }
    assertIsMesh(child);
    meshes.push(child)
  })

  return meshes;
}

export function assertIsMaterial(value: any): asserts value is Material {
  if (!value?.isMaterial) {
    throw Error('value is not a material')
  }
}

export function assertIsClip(value: any): asserts value is AnimationClip {
  if (!value) {
    throw Error('value is not a clip')
  }
}

export function assertIsNotNullish<T>(value: T | null | undefined): asserts value is T {
  if (value === undefined || value === null) {
    throw Error('value is nullish');
  }
}
