import { Scene } from "three"

export const createScene = (name: string) => {
  const scene = new Scene();
  scene.name = name;
  return scene;
}
