import { TextureLoader, WebGLRenderer } from "three";

export default async function loadTexture(
  _: WebGLRenderer, path: string) {
  const loader = new TextureLoader();
  const envMap = await loader.loadAsync(path);
  return envMap;
};
