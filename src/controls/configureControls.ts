import { OrbitControls } from "@3dvf/create-viewer/create-camera/orbit-controls";

export default function configureControls(controls: OrbitControls) {
  controls.enablePan = false;
  controls.rotateSpeed = 0.2;
  controls.minDistance = 2.5;
  controls.maxDistance = 2.5;
  controls.maxPolarAngle = 3.1;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
}
