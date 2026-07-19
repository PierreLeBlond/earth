import type { BufferGeometry, Material, Scene, Texture, WebGLRenderTarget } from 'three';

export const disposeTracked = (scene: Scene) => {
	scene.userData['disposables']?.forEach(
		(disposable: Texture | Material | WebGLRenderTarget | BufferGeometry) =>
			disposable.dispose()
	);
};
