import { EventDispatcher, NearestFilter, TextureLoader, Texture, Scene, WebGLRenderer, Color } from "three";
import OffsetCamera from '@3dvf/create-viewer/create-camera/offset-camera';

import earth_map_path from "../assets/textures/map_black_outline_alpha.png";
import index_map_path from "../assets/textures/map_indexed.png";
import pbr_map_path from "../assets/textures/map_metallic_roughness.png";
import configureControls from "../controls/configureControls";
import { getFinalScene } from "../scenes/getFinalScene";
import { getIndex } from "../getIndex";
import { getDetectorScene } from "../scenes/getDetectorScene";
import { getEarthScene } from "../scenes/getEarthScene";

import { countryColorMap, countryNames } from "./data";
import { CreateViewerReturnType } from "@3dvf/create-viewer/create-viewer";
import { addToDisposeTracker } from "@3dvf/dispose-tracker/add-to-dispose-tracker";
import { loadIBL } from "@3dvf/load-ibl/load-ibl";

export type AppEvent = {
  country: { message: string };
};

export default class App {
  private textureLoader = new TextureLoader();

  private savedTime = new Date().getTime();

  private earthScene: Scene;
  private detectorScene: Scene;
  private finalScene: Scene;

  private index_map: Texture | null = null;
  private earth_map: Texture | null = null;
  private pbr_map: Texture | null = null;

  private domElement: HTMLElement;
  private countryName: string = "";

  private width = 0;
  private height = 0;

  private mousemoveEventListener: {
    (event: MouseEvent): void;
    (this: HTMLElement, ev: MouseEvent): any;
    (this: HTMLElement, ev: MouseEvent): any;
  } = () => { };
  private resizeEventListener: { (): void; (this: Window, ev: UIEvent): any } =
    () => { };
  private updatePreprocessesEventListener: {
    ({
      camera,
      renderer,
    }: {
      camera: OffsetCamera;
      renderer: WebGLRenderer;
    }): void;
  } = () => { };

  private eventDispatcher = new EventDispatcher<AppEvent>();

  public viewer: CreateViewerReturnType;

  constructor(viewer: CreateViewerReturnType, element: HTMLElement) {
    this.viewer = viewer;
    this.domElement = element;

    this.detectorScene = getDetectorScene(
      this.viewer.scene,
      this.domElement.offsetWidth,
      this.domElement.offsetHeight
    );

    this.earthScene = getEarthScene(
      this.viewer.scene,
      this.domElement.offsetWidth,
      this.domElement.offsetHeight
    );

    this.finalScene = getFinalScene(this.viewer.scene);
  }

  private addEventListeners = () => {
    this.updatePreprocessesEventListener = ({
      camera,
      renderer,
    }: {
      camera: OffsetCamera;
      renderer: WebGLRenderer;
    }) => {
      this.render(camera, renderer, this.detectorScene, this.earthScene, this.finalScene);
    };
    this.mousemoveEventListener = (event: MouseEvent) =>
      this.mousemove(event, this.detectorScene, this.finalScene);
    this.resizeEventListener = () => this.resize();

    this.domElement.addEventListener(
      "mousemove",
      this.mousemoveEventListener,
      false
    );
    window.addEventListener("resize", this.resizeEventListener, false);
    this.viewer.eventDispatcher
      .addEventListener(
        "updatePreprocesses",
        this.updatePreprocessesEventListener
      );
  };

  public async loadIbl(irradiancePath: string, radiancePath: string) {
    return loadIBL(this.viewer.renderer, this.earthScene, irradiancePath, radiancePath, '/assets/basis/')
  }

  public async start() {
    this.viewer.disableScene();

    this.viewer.camera.position.set(2, 0, 0);
    this.viewer.camera.absoluteFov = 50;
    this.viewer.camera.fov = 50;
    configureControls(this.viewer.controls);


    this.viewer.addTasks(this.getTasks());
    await this.viewer.launchTasks();

    (
      this.detectorScene.getObjectByName("detector") as any
    ).material.uniforms.map.value = this.index_map;

    const earth = this.earthScene.getObjectByName("earth") as any;
    earth.material.color = new Color(1, 1, 1);
    earth.material.map = this.earth_map;
    earth.material.roughnessMap = this.pbr_map;
    earth.material.metalnessMap = this.pbr_map;

    (
      this.finalScene.getObjectByName("final") as any
    ).material.uniforms.index_map.value =
      this.detectorScene.userData["renderTarget"].texture;

    this.addEventListeners();

    this.resize();
  }

  public stop() {
    this.domElement.removeEventListener(
      "mousemove",
      this.mousemoveEventListener,
      false
    );
    window.removeEventListener("resize", this.resizeEventListener, false);
    this.viewer.eventDispatcher
      .removeEventListener(
        "updatePreprocesses",
        this.updatePreprocessesEventListener
      );
  }

  private getTasks() {
    return [
      async () => {
        this.index_map = await this.textureLoader.loadAsync(index_map_path);
        this.index_map.magFilter = NearestFilter;
        this.index_map.minFilter = NearestFilter;
        addToDisposeTracker(this.viewer.scene, this.index_map);
      },
      async () => {
        this.earth_map = await this.textureLoader.loadAsync(earth_map_path);
        addToDisposeTracker(this.viewer.scene, this.earth_map);
      },
      async () => {
        this.pbr_map = await this.textureLoader.loadAsync(pbr_map_path);
        addToDisposeTracker(this.viewer.scene, this.pbr_map);
      },
    ];
  }

  private mousemove(
    event: MouseEvent,
    detectorScene: Scene,
    finalScene: Scene
  ) {
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - this.savedTime;
    if (elapsedTime < 20) {
      return;
    }
    var x = event.clientX - this.domElement.getBoundingClientRect().left;
    var y = event.clientY - this.domElement.getBoundingClientRect().top;
    var index = getIndex(
      this.viewer.renderer,
      detectorScene.userData["renderTarget"],
      x,
      y
    );
    (
      finalScene.getObjectByName("final") as any
    ).material.uniforms.picked_index.value = index;
    this.savedTime = currentTime;
    const newCountryName = this.getCountryName(index);
    if (newCountryName == this.countryName) {
      return;
    }
    this.countryName = newCountryName;
    this.eventDispatcher.dispatchEvent({
      type: "country",
      message: this.countryName,
    });
  }

  private getCountryName(index: number) {
    for (var i in countryColorMap) {
      if (countryColorMap.hasOwnProperty(i)) {
        if (index == countryColorMap[i]) return countryNames[i] as string;
      }
    }
    return "";
  }

  private render(
    camera: OffsetCamera,
    renderer: WebGLRenderer,
    detectorScene: Scene,
    earthScene: Scene,
    finalScene: Scene
  ) {
    renderer.setRenderTarget(detectorScene.userData["renderTarget"]);
    renderer.render(detectorScene, camera);

    renderer.setRenderTarget(earthScene.userData["renderTarget"]);
    renderer.render(earthScene, camera);

    (finalScene.getObjectByName("final") as any).material.uniforms.map.value =
      earthScene.userData["renderTarget"].texture;

    renderer.setRenderTarget(null);

    renderer.render(finalScene, camera)
  }

  private resize() {
    this.width = this.domElement.offsetWidth;
    this.height = this.domElement.offsetHeight;

    this.detectorScene.userData["renderTarget"].setSize(this.width, this.height);
    this.earthScene.userData["renderTarget"].setSize(this.width, this.height);
  }

  public dispose() {
    this.stop();
    this.viewer.enableScene();
  }

  public getEventDispatcher() {
    return this.eventDispatcher;
  }
}
