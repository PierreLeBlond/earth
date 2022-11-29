import { Viewer } from '@s0rt/3d-viewer';

export default function configureControls(viewer: Viewer) {
  const { controls } = viewer;
  controls.enablePan = false;
  controls.rotateSpeed = 0.2;
  controls.minDistance = 2.5;
  controls.maxDistance = 2.5;
  controls.maxPolarAngle = 3.1;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
}
