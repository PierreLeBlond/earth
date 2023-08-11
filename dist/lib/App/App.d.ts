import { PublicViewer, THREE, Viewer } from '@s0rt/3d-viewer';
export default class App extends THREE.EventDispatcher {
    private textureLoader;
    private savedTime;
    private index_map;
    private earth_map;
    private pbr_map;
    publicViewer: PublicViewer;
    viewer: Viewer;
    private domElement;
    private countryName;
    private width;
    private height;
    private mousemoveEventListener;
    private resizeEventListener;
    private updatePreprocessesEventListener;
    constructor(publicViewer: PublicViewer);
    private addEventListeners;
    start(): Promise<void>;
    stop(): void;
    private getTasks;
    private mousemove;
    private getCountryName;
    private render;
    private resize;
    dispose(): void;
}
