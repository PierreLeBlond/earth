export function getIndex(renderer: THREE.WebGLRenderer, renderTarget: THREE.WebGLRenderTarget, x: number, y: number) {
  const buffer = new Uint8Array(4);

  renderer.readRenderTargetPixels(
    renderTarget, x, renderer.domElement.height - y, 1, 1,
    buffer);

  var index = buffer[0];

  return index > 0 ? index : -1;
}