import { Clock, EventDispatcher, Scene, WebGLRenderer } from 'three';
import createRenderer from './create-renderer';
import { createCamera } from './create-camera/create-camera';
import OffsetCamera from './create-camera/offset-camera';
import { disposeTracked } from '@3dvf/dispose-tracker/dispose-tracked';
import { OrbitControls } from './create-camera/orbit-controls';

export type Task = () => Promise<void>;

export type ViewerEvent = {
  taskCompleted: { progression: number };
  updated: object;
  updatePreprocesses: {
    camera: OffsetCamera;
    renderer: WebGLRenderer;
  };
  resize: {
    width: number;
    height: number;
  };
  animate: {
    delta: number;
  };
};

export type CreateViewerReturnType = {
  launch: () => void,
  addTasks: (tasks: Task[]) => void,
  launchTasks: () => Promise<void>,
  pause: () => void,
  play: () => void,
  dispose: () => void,
  disableScene: () => void,
  enableScene: () => void,
  eventDispatcher: EventDispatcher<ViewerEvent>,
  renderer: WebGLRenderer,
  scene: Scene,
  camera: OffsetCamera,
  controls: OrbitControls
}

export const createViewer = (element: HTMLElement) => {
  if (!element) {
    throw new Error('init: element not found');
  }

  const clock = new Clock();
  const eventDispatcher = new EventDispatcher<ViewerEvent>();
  let animationFrameHandle: number = -1;

  const renderer = createRenderer(element);
  const { camera, controls } = createCamera(renderer);

  const scene = new Scene();

  const tasks: Task[] = [];

  const disableScene = () => {
    scene.userData["disabled"] = true;
  }

  const enableScene = () => {
    scene.userData["disabled"] = false;
  }

  const render = () => {
    eventDispatcher.dispatchEvent({
      type: 'updatePreprocesses',
      camera,
      renderer
    });

    if (scene.userData["disabled"]) {
      return;
    }

    renderer.render(scene, camera);
  };

  const update = () => {
    // 1. Update animations
    const delta = clock.getDelta();
    eventDispatcher.dispatchEvent({ type: 'animate', delta });

    // 2. Update controls after animations in case camera itself is animated
    controls.update(0);

    // 3. Render the scene
    render();

    eventDispatcher.dispatchEvent({ type: 'updated' });
  };

  const requestUpdate = () => {
    animationFrameHandle = requestAnimationFrame(() => update());
  };

  const resize = () => {
    const { parentElement } = renderer.domElement;
    if (!parentElement) {
      throw new Error('dom element has no parent');
    }
    const { clientWidth, clientHeight } = parentElement;
    camera.aspect = clientWidth / clientHeight;
    const isHorizontal = camera.aspect <= camera.verticalRatio;
    camera.fov = isHorizontal
      ? (Math.atan(
        (Math.tan((camera.absoluteFov * Math.PI) / 360) * camera.verticalRatio) / camera.aspect
      ) *
        360) /
      Math.PI
      : camera.absoluteFov;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);

    eventDispatcher.dispatchEvent({
      type: 'resize',
      width: clientWidth,
      height: clientHeight
    });
    render();
  };

  // Enable looping behaviour but does not actually call the render loop
  const activateRenderLoop = () => {
    eventDispatcher.addEventListener('updated', requestUpdate);
    clock.getDelta();
  };

  const launch = () => {
    activateRenderLoop();

    window.addEventListener('resize', resize, false);
    resize();
    update();
  };

  const pause = () => {
    eventDispatcher.removeEventListener('updated', requestUpdate);
    cancelAnimationFrame(animationFrameHandle);
  };

  const play = () => {
    activateRenderLoop();
    update();
  };

  const dispose = () => {
    pause();
    window.removeEventListener('resize', resize, false);

    disposeTracked(scene);

    controls.disconnect();
    controls.dispose();

    renderer.dispose();
  };

  const addTasks = (addedTasks: Task[]) => {
    tasks.push(...addedTasks);
  }

  const launchTasks = async () => {
    const taskCount = tasks.length;
    let completedTaskCount = 0;
    eventDispatcher.dispatchEvent({
      type: "taskCompleted",
      progression: 0,
    });
    await Promise.all(tasks.map(async (task: Task) => {
      await task();
      completedTaskCount++;
      eventDispatcher.dispatchEvent({
        type: "taskCompleted",
        progression: completedTaskCount / taskCount,
      });
    }));

    tasks.length = 0;
  }

  return {
    launch,
    addTasks,
    launchTasks,
    pause,
    play,
    dispose,
    eventDispatcher,
    renderer,
    scene,
    disableScene,
    enableScene,
    camera,
    controls
  };
};
