import type { BufferGeometry, Material, Scene, Texture, WebGLRenderTarget } from 'three';

export const addToDisposeTracker = (
	scene: Scene,
	disposable: Texture | Material | WebGLRenderTarget | BufferGeometry
) => {
	if (!scene.userData['disposables']) {
		scene.userData['disposables'] = new Set();
	}

	scene.userData['disposables'].add(disposable);
};
