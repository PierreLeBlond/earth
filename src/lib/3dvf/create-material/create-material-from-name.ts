import createMaterial from './create-material';
import { ImageLoader, RepeatWrapping, Texture, type Scene } from 'three';
import { addToDisposeTracker } from '@3dvf/dispose-tracker/add-to-dispose-tracker';

/*
* Strongly opiniated way of retrieving textures
*/
export const getTextureUrl = (suffixe: string) => (basePath: string, name: string) => {
	return `${basePath}${name}/${name}_${suffixe}`;
};

export const createMaterialFromName = async (scene: Scene, basePath: string, name: string) => {
	const loader = new ImageLoader();

	const [albedoImage, normalImage, ormImage] = await Promise.all([
		loader.loadAsync(getTextureUrl('albedo.jpg')(basePath, name)),
		loader.loadAsync(getTextureUrl('normal.jpg')(basePath, name)),
		loader.loadAsync(getTextureUrl('orm.jpg')(basePath, name))
	]);

  const material = createMaterial(scene);

  material.name = name;
	
	material.map = new Texture(albedoImage);
  material.map.wrapS = RepeatWrapping;
  material.map.wrapT = RepeatWrapping;
  material.map.needsUpdate = true;
  
	material.normalMap = new Texture(normalImage);
  material.normalMap.wrapS = RepeatWrapping;
  material.normalMap.wrapT = RepeatWrapping;
  material.normalMap.needsUpdate = true;
	
	const ormTexture = new Texture(ormImage);
	ormTexture.wrapS = RepeatWrapping;
  ormTexture.wrapT = RepeatWrapping;
  ormTexture.needsUpdate = true;
  
	material.roughnessMap = ormTexture;
	material.metalnessMap = ormTexture;
	material.aoMap = ormTexture;

	material.needsUpdate = true;

	addToDisposeTracker(scene, material.map);
	addToDisposeTracker(scene, material.normalMap);
	addToDisposeTracker(scene, material.roughnessMap);

	return material;
};
