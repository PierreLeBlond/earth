import { LinearFilter, LinearMipmapLinearFilter, LinearSRGBColorSpace } from 'three';
import type { Texture  } from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

export const loadKTXTexture = async (loader: KTX2Loader, path: string): Promise<Texture> => {
  const texture = await loader.loadAsync(path);
  
	texture.minFilter = LinearMipmapLinearFilter;
	texture.magFilter = LinearFilter;
	texture.colorSpace = LinearSRGBColorSpace;

	return texture;
};
