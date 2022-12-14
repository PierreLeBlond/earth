import { Material, PublicViewer, THREE, Viewer } from '@s0rt/3d-viewer';

import earth_map_path from '../assets/textures/map_black_outline_alpha.png';
import index_map_path from '../assets/textures/map_indexed.png';
import pbr_map_path from '../assets/textures/map_metallic_roughness.png';
import configureControls from '../controls/configureControls';
import { getFinalScene } from '../scenes/getFinalScene';
import { getIndex } from '../getIndex';
import { getDetectorScene } from '../scenes/getDetectorScene';
import { getEarthScene } from '../scenes/getEarthScene';

import { countryColorMap, countryName } from './data';
import { Mesh } from 'three';

export default class App extends THREE.EventDispatcher {
  private textureLoader = new THREE.TextureLoader();

  private savedTime = new Date().getTime();

  private index_map: THREE.Texture = null;
  private earth_map: THREE.Texture = null;
  private pbr_map: THREE.Texture = null;

  public publicViewer: PublicViewer;
  public viewer: Viewer;

  private domElement: HTMLElement;
  private countryNameElement: HTMLElement = null;

  private width = 0;
  private height = 0;

  private mousemoveEventListener: { (event: MouseEvent): void; (this: HTMLElement, ev: MouseEvent): any; (this: HTMLElement, ev: MouseEvent): any; };
  private resizeEventListener: { (): void; (this: Window, ev: UIEvent): any; };
  private updatePreprocessesEventListener: { ({ camera, renderer }: { camera: any; renderer: any; }): void; (event: THREE.Event & { type: "updatePreprocesses"; } & { target: Viewer; }): void; };

  constructor(publicViewer: PublicViewer) {
    super();
    this.publicViewer = publicViewer;

    this.viewer = this.publicViewer.viewer;
    this.domElement = this.viewer.element;
  }

  public async start() {
    let detectorScene = this.viewer.getScene("earth-detector");
    let earthScene = this.viewer.getScene("earth-main");
    let finalScene = this.viewer.getScene("earth-final");

    if (!earthScene) {
      detectorScene = getDetectorScene(this.viewer, this.domElement.offsetWidth, this.domElement.offsetHeight)

      earthScene = getEarthScene(this.viewer, this.domElement.offsetWidth, this.domElement.offsetHeight);

      finalScene = getFinalScene(this.viewer)

      this.publicViewer.addTasks(this.getTasks());
      await this.publicViewer.launchTasks();

      (detectorScene.getObjectByName('detector') as any).material.uniforms.map.value = this.index_map;

      const earth = earthScene.getObjectByName('earth') as any;
      earth.material.map = this.earth_map;
      earth.material.roughnessMap = this.pbr_map;
      earth.material.metalnessMap = this.pbr_map;

      (finalScene.getObjectByName('final') as any).material.uniforms.index_map.value =
        detectorScene.userData.renderTarget.texture;
    }

    this.viewer.setScene(finalScene);
    this.viewer.camera.position.set(2, 0, 0);
    configureControls(this.viewer);

    this.updatePreprocessesEventListener = ({ camera, renderer }) => {
      this.render(camera, renderer, detectorScene, earthScene, finalScene);
    };
    this.mousemoveEventListener = (event: MouseEvent) => this.mousemove(event, detectorScene, finalScene);
    this.resizeEventListener = () => this.resize(detectorScene, earthScene);

    this.domElement.addEventListener(
      'mousemove', this.mousemoveEventListener, false);
    window.addEventListener('resize', this.resizeEventListener, false);
    this.viewer.addEventListener('updatePreprocesses', this.updatePreprocessesEventListener);
    this.createCountryElement();

    this.resize(detectorScene, earthScene);
  }

  public stop() {
    this.domElement.removeChild(this.countryNameElement);

    this.domElement.removeEventListener('mousemove', this.mousemoveEventListener, false);
    window.removeEventListener('resize', this.resizeEventListener, false);
    this.viewer.removeEventListener('updatePreprocesses', this.updatePreprocessesEventListener);
  }

  private createCountryElement() {
    this.countryNameElement = document.createElement('div');
    this.domElement.appendChild(this.countryNameElement);
    this.countryNameElement.style.position = 'absolute';
    this.countryNameElement.style.width = '100%';
    this.countryNameElement.style.bottom = '15%';
    this.countryNameElement.style.textAlign = 'center';
    this.countryNameElement.style.color = '#444';
    this.countryNameElement.style.userSelect = 'none';
  }

  private getTasks() {
    return {
      parallelTasks: [
        {
          task: async () => {
            this.index_map = await this.textureLoader.loadAsync(index_map_path);
            this.index_map.magFilter = THREE.NearestFilter;
            this.index_map.minFilter = THREE.NearestFilter;
          }
        },
        {
          task: async () => {
            this.earth_map = await this.textureLoader.loadAsync(earth_map_path);
          }
        },
        {
          task: async () => {
            this.pbr_map = await this.textureLoader.loadAsync(pbr_map_path);
          }
        },
      ]
    };
  }

  private mousemove(event: MouseEvent, detectorScene: THREE.Scene, finalScene: THREE.Scene) {
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - this.savedTime;
    if (elapsedTime > 20) {
      var x = event.clientX - this.domElement.getBoundingClientRect().left;
      var y = event.clientY - this.domElement.getBoundingClientRect().top;
      var index = getIndex(this.viewer.renderer, detectorScene.userData.renderTarget, x, y);
      (finalScene.getObjectByName('final') as any).material.uniforms.picked_index.value = index;
      this.savedTime = currentTime;
      this.countryNameElement.innerHTML = this.getCountryName(index);
    }
  }

  private getCountryName(index: number) {
    for (var i in countryColorMap) {
      if (countryColorMap.hasOwnProperty(i)) {
        if (index == countryColorMap[i]) return countryName[i];
      }
    }
    return '';
  }

  private render(
    camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, detectorScene: THREE.Scene, earthScene: THREE.Scene, finalScene: THREE.Scene) {

    renderer.setRenderTarget(detectorScene.userData.renderTarget);
    renderer.render(detectorScene, camera);

    renderer.setRenderTarget(earthScene.userData.renderTarget);
    renderer.render(earthScene, camera);

    (finalScene.getObjectByName('final') as any).material.uniforms.map.value = earthScene.userData.renderTarget.texture;

    renderer.setRenderTarget(null);
  }

  private resize(detectorScene: THREE.Scene, earthScene: THREE.Scene) {
    this.width = this.domElement.offsetWidth;
    this.height = this.domElement.offsetHeight;

    detectorScene.userData.renderTarget.setSize(this.width, this.height);
    earthScene.userData.renderTarget.setSize(this.width, this.height);
  }

  public dispose() {
    this.stop();

    this.index_map.dispose();
    this.earth_map.dispose();
    this.pbr_map.dispose();

    const finalScene = this.viewer.getScene('earth-final');
    if (finalScene) {
      const mesh = <Mesh><unknown>finalScene.getObjectByName('final');
      mesh.geometry.dispose();
      (<Material><unknown>mesh.material).dispose();
    }

    const earthScene = this.viewer.getScene('earth-main');
    if (earthScene) {
      earthScene.userData.renderTarget.dispose();
      const mesh = <Mesh><unknown>earthScene.getObjectByName('earth');
      mesh.geometry.dispose();
      (<Material><unknown>mesh.material).dispose();
    }

    const detectorScene = this.viewer.getScene('earth-detector');
    if (detectorScene) {
      detectorScene.userData.renderTarget.dispose();
      const mesh = <Mesh><unknown>detectorScene.getObjectByName('detector');
      mesh.geometry.dispose();
      (<Material><unknown>mesh.material).dispose();
    }

    this.publicViewer.dispose();
  }
}
