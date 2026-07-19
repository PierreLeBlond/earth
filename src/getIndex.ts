import { WebGLRenderer, WebGLRenderTarget } from "three";

export function getIndex(
  renderer: WebGLRenderer,
  renderTarget: WebGLRenderTarget,
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
