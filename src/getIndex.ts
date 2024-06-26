import { THREE } from "@s0rt/3d-viewer";

export function getIndex(
  renderer: THREE.WebGLRenderer,
  renderTarget: THREE.WebGLRenderTarget,
  x: number,
  y: number
) {
  const buffer = new Uint8Array(4);

  renderer.readRenderTargetPixels(
    renderTarget,
    x,
    renderer.domElement.height - y,
    1,
    1,
    buffer
  );

  var index = buffer[0];

  if (!index) {
    return -1;
  }

  return index;
}
