import type { Scene } from 'three';
import { Material } from './material';
import { addToDisposeTracker } from '@3dvf/dispose-tracker/add-to-dispose-tracker';

export default function createMaterial(scene: Scene): Material {
  const material = new Material();

  addToDisposeTracker(scene, material);

  return material;
}
