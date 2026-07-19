import { WebGLRenderer } from "three";
import OffsetCamera from "./offset-camera";
import { OrbitControls } from "./orbit-controls";

export const createCamera = (renderer: WebGLRenderer) => {
  const camera = new OffsetCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 1;
  controls.maxDistance = 100;
  controls.maxPolarAngle = 1.5;

  camera.position.set(0, 1, 5);
  controls.update(0);

  return { camera, controls };
};
