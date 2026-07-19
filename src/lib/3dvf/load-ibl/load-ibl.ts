import {
  ImageLoader,
  LinearFilter,
  LinearMipmapLinearFilter,
  Matrix4,
  NearestFilter,
  Scene,
  WebGLRenderer,
} from "three";
import { loadKTXTexture } from "./load-ktx-texture";
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { addToDisposeTracker } from "@3dvf/dispose-tracker/add-to-dispose-tracker";
import brdfPath from "./brdf_uastc.ktx2";

export const loadIBL = async (
  renderer: WebGLRenderer,
  scene: Scene,
  irradiancePath: string,
  radiancePath: string,
  transcoderPath: string
): Promise<void> => {
  const loader = new ImageLoader();

  let ktx2Loader: KTX2Loader = scene.userData["ktx2Loader"];
  if (!ktx2Loader) {
    ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath(transcoderPath);
    ktx2Loader.detectSupport(renderer);
    scene.userData["ktx2Loader"] = loader;
  }

  const [radiance, irradiance, brdf] = await Promise.all([
    loadKTXTexture(ktx2Loader, radiancePath),
    loadKTXTexture(ktx2Loader, irradiancePath),
    loadKTXTexture(ktx2Loader, brdfPath),
  ]);

  addToDisposeTracker(scene, radiance);
  addToDisposeTracker(scene, irradiance);

  radiance.minFilter = LinearMipmapLinearFilter;
  irradiance.minFilter = LinearFilter;

  brdf.minFilter = NearestFilter;
  brdf.magFilter = NearestFilter;
  brdf.generateMipmaps = false;

  brdf.needsUpdate = true;

  addToDisposeTracker(scene, brdf);

  scene.userData["ibl"] = {
    radiance,
    irradiance,
    matrix: new Matrix4(),
  };
  scene.userData["brdf"] = brdf;
  scene.userData["iblSpace"] = "world";
};
