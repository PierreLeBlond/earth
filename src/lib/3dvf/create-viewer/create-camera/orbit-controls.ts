import {
	EventDispatcher,
	Matrix4,
	MOUSE,
	PerspectiveCamera,
	Quaternion,
	Spherical,
	TOUCH,
	Vector2,
	Vector3
} from 'three';

type OrbitControlsEvent = {
	type: 'change' | 'start' | 'end';
};

/**
 * Fires when the camera has been transformed by the controls.
 *
 * @event OrbitControls#change
 */
const _changeEvent: OrbitControlsEvent = { type: 'change' };

/**
 * Fires when an interaction was initiated.
 *
 * @event OrbitControls#start
 */
const _startEvent: OrbitControlsEvent = { type: 'start' };

/**
 * Fires when an interaction has finished.
 *
 * @event OrbitControls#end
 */
const _endEvent: OrbitControlsEvent = { type: 'end' };

const _v = new Vector3();
const _twoPI = 2 * Math.PI;

const _STATE = {
	NONE: -1,
	ROTATE: 0,
	DOLLY: 1,
	PAN: 2,
	TOUCH_ROTATE: 3,
	TOUCH_PAN: 4,
	TOUCH_DOLLY_PAN: 5,
	TOUCH_DOLLY_ROTATE: 6
};
const _EPS = 0.00001;

const MOUSE_MOVE_DOLLY_FACTOR = 0.03;

/**
 * Orbit controls allow the camera to orbit around a target.
 *
 * Modified from https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/OrbitControls.js
 *
 * The coordinates system is as follow :
 * - right-handed, with Y as up, X as right and Z as backward
 * - Pitch goes to from PI when facing up, to 0 when facing down
 * - Yaw is at 0 when looking at origin from +Z axis, and goes to -PI when rotating left, and PI when rotating right. A yaw of -PI or PI is therefore equivalent, when looking at origin from the -Z axis.
 *
 * OrbitControls performs orbiting, dollying (zooming), and panning. Unlike {@link TrackballControls},
 * it maintains the "up" direction `object.up` (+Y by default).
 *
 * - Orbit: Left mouse / touch: one-finger move.
 * - Zoom: Middle mouse, or mousewheel / touch: two-finger spread or squish.
 * - Pan: Right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move.
 *
 * ```js
 * const controls = new OrbitControls( camera, renderer.domElement );
 *
 * // controls.update() must be called after any manual changes to the camera's transform
 * camera.position.set( 0, 20, 100 );
 * controls.update();
 *
 * function animate() {
 *
 * 	// required if controls.enableDamping or controls.autoRotate are set to true
 * 	controls.update();
 *
 * 	renderer.render( scene, camera );
 *
 * }
 * ```
 *
 * @augments Controls
 * @three_import import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
 */
class OrbitControls extends EventDispatcher<{
	change: OrbitControlsEvent;
	start: OrbitControlsEvent;
	end: OrbitControlsEvent;
}> {
	public camera: PerspectiveCamera;

	public domElement: HTMLElement | null = null;

	public state = _STATE.NONE;

	/**
	 * The focus point of the controls, the `object` orbits around this.
	 * It can be updated manually at any point to change the focus of the controls.
	 */
	public target = new Vector3();

	/**
	 * How far you can dolly in (perspective camera only).
	 */
	public minDistance = 0;

	/**
	 * How far you can dolly out (perspective camera only).
	 */
	public maxDistance = Infinity;

	/**
	 * How far you can zoom in (orthographic camera only).
	 */
	public minZoom = 0;

	/**
	 * How far you can zoom out (orthographic camera only).
	 */
	public maxZoom = Infinity;

	/**
	 * The scene reference center, from which the target bounding box revolve around
	 */
	public sceneCenter = new Vector3(0, 0, 0);

	public sceneSize = 1;

	/**
	 * The rotation of the target bounding box around the up axis
	 *
	 * @type {number}
	 */
	public targetYaw = 0;

	public minTarget = new Vector3(-Infinity, -Infinity, -Infinity);
	public maxTarget = new Vector3(Infinity, Infinity, Infinity);

	/**
	 * How far you can orbit vertically, lower limit. Range is `[0, Math.PI]` radians.
	 */
	public minPolarAngle = 0;

	/**
	 * How far you can orbit vertically, upper limit. Range is `[0, Math.PI]` radians.
	 */
	public maxPolarAngle = Math.PI;

	/**
	 * How far you can orbit horizontally, lower limit. If set, the interval `[ min, max ]`
	 * must be a sub-interval of `[ - 2 PI, 2 PI ]`, with `( max - min < 2 PI )`.
	 */
	public minAzimuthAngle = -Infinity;

	/**
	 * How far you can orbit horizontally, upper limit. If set, the interval `[ min, max ]`
	 * must be a sub-interval of `[ - 2 PI, 2 PI ]`, with `( max - min < 2 PI )`.
	 */
	public maxAzimuthAngle = Infinity;

	/**
	 * Set to `true` to enable damping (inertia), which can be used to give a sense of weight
	 * to the controls. Note that if this is enabled, you must call `update()` in your animation
	 * loop.
	 */
	public enableDamping = false;

	/**
	 * The damping inertia used if `enableDamping` is set to `true`.
	 *
	 * Note that for this to work, you must call `update()` in your animation loop.
	 */
	public dampingFactor = 0.05;

	/**
	 * The zoom damping inertia used if `enableDamping` is set to `true`.
	 *
	 * Note that for this to work, you must call `update()` in your animation loop.
	 */
	public zoomDampingFactor = 0.05;

	/**
	 * Enable or disable zooming (dollying) of the camera.
	 */
	public enableZoom = true;

	/**
	 * Speed of zooming / dollying.
	 */
	public zoomSpeed = 1.0;

	/**
	 * Enable or disable horizontal and vertical rotation of the camera.
	 *
	 * Note that it is possible to disable a single axis by setting the min and max of the
	 * `minPolarAngle` or `minAzimuthAngle` to the same value, which will cause the vertical
	 * or horizontal rotation to be fixed at that value.
	 */
	public enableRotate = true;

	/**
	 * Speed of rotation.
	 */
	public rotateSpeed = 1.0;

	/**
	 * How fast to rotate the camera when the keyboard is used.
	 */
	public keyRotateSpeed = 1.0;

	/**
	 * Enable or disable camera panning.
	 */
	public enablePan = true;

	/**
	 * Speed of panning.
	 */
	public panSpeed = 1.0;

	/**
	 * How fast to pan the camera when the keyboard is used in
	 * pixels per keypress.
	 */
	public keyPanSpeed = 7.0;

	/**
	 * Set to true to automatically rotate around the target
	 *
	 * Note that if this is enabled, you must call `update()` in your animation loop.
	 * If you want the auto-rotate speed to be independent of the frame rate (the refresh
	 * rate of the display), you must pass the time `deltaTime`, in seconds, to `update()`.
	 */
	public autoRotate = false;

	/**
	 * How fast to rotate around the target if `autoRotate` is `true`. The default  equates to 30 seconds
	 * per orbit at 60fps.
	 *
	 * Note that if `autoRotate` is enabled, you must call `update()` in your animation loop.
	 */
	public autoRotateSpeed = 2.0;

	/**
	 * This object contains references to the keycodes for controlling camera panning.
	 *
	 * ```js
	 * controls.keys = {
	 * 	LEFT: 'ArrowLeft', //left arrow
	 * 	UP: 'ArrowUp', // up arrow
	 * 	RIGHT: 'ArrowRight', // right arrow
	 * 	BOTTOM: 'ArrowDown' // down arrow
	 * }
	 * ```
	 */
	public keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

	/**
	 * This object contains references to the mouse actions used by the controls.
	 *
	 * ```js
	 * controls.mouseButtons = {
	 * 	LEFT: THREE.MOUSE.ROTATE,
	 * 	MIDDLE: THREE.MOUSE.DOLLY,
	 * 	RIGHT: THREE.MOUSE.PAN
	 * }
	 * ```
	 */
	public mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };

	/**
	 * This object contains references to the touch actions used by the controls.
	 *
	 * ```js
	 * controls.mouseButtons = {
	 * 	ONE: THREE.TOUCH.ROTATE,
	 * 	TWO: THREE.TOUCH.DOLLY_PAN
	 * }
	 * ```
	 */
	public touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };

	// the target DOM element for key events
	private _domElementKeyEvents: HTMLElement | null = null;

	// internals

	private _lastPosition = new Vector3();
	private _lastQuaternion = new Quaternion();
	private _lastTargetPosition = new Vector3();

	// so camera.up is the orbit axis
	private _quat = new Quaternion();
	private _quatInverse = new Quaternion();

	// current position in spherical coordinates
	private _spherical = new Spherical();
	private _sphericalDelta = new Spherical();

	private _scale = 1;
	private _scaleDelta = 0;
	private _panOffset = new Vector3();

	private _rotateStart = new Vector2();
	private _rotateEnd = new Vector2();
	private _rotateDelta = new Vector2();

	private _panStart = new Vector2();
	private _panEnd = new Vector2();
	private _panDelta = new Vector2();

	private _dollyStart = new Vector2();
	private _dollyEnd = new Vector2();
	private _dollyDelta = new Vector2();

	private _pointers: number[] = [];
	private _pointerPositions: Record<number, Vector2> = {};

	private _controlActive = false;

	/**
	 * Constructs a new controls instance.
	 *
	 * @param {PerspectiveCamera} camera - The camera that is managed by the controls.
	 * @param {?HTMLDOMElement} domElement - The HTML element used for event listeners.
	 */
	constructor(camera: PerspectiveCamera, domElement: HTMLElement | null = null) {
		super();

		this.camera = camera;

		this._quat = new Quaternion().setFromUnitVectors(camera.up, new Vector3(0, 1, 0));
		this._quatInverse = this._quat.clone().invert();

		if (domElement !== null) {
			this.connect(domElement);
		}

		this.update(0);
	}

	private _onPointerDownListener = (event: PointerEvent) => {
		this._onPointerDown(event);
	};

	private _onPointerMoveListener = (event: PointerEvent) => {
		this._onPointerMove(event);
	};

	private _onPointerUpListener = (event: PointerEvent) => {
		this._onPointerUp(event);
	};

	private _onContextMenuListener = (event: MouseEvent) => {
		this._onContextMenu(event);
	};

	private _onMouseWheelListener = (event: WheelEvent) => {
		this._onMouseWheel(event);
	};

	private _interceptControlDownListener = (event: KeyboardEvent) => {
		this._interceptControlDown(event);
	};

	private _interceptControlUpListener = (event: KeyboardEvent) => {
		this._interceptControlUp(event);
	};

	private _onKeyDownListener = (event: KeyboardEvent) => {
		this._onKeyDown(event);
	};

	public connect(element: HTMLElement) {
		this.domElement = element;

		element.addEventListener('pointerdown', this._onPointerDownListener);
		element.addEventListener('pointermove', this._onPointerMoveListener);
		element.addEventListener('pointerup', this._onPointerUpListener);
		element.addEventListener('pointercancel', this._onPointerUpListener);

		element.addEventListener('contextmenu', this._onContextMenuListener);
		element.addEventListener('wheel', this._onMouseWheelListener, { passive: false });

		window.addEventListener('keydown', this._interceptControlDownListener, {
			passive: true,
			capture: true
		});

		element.style.touchAction = 'none'; // disable touch scroll
	}

	public disconnect() {
		if (!this.domElement) {
			return;
		}

		this.domElement.removeEventListener('pointerdown', this._onPointerDownListener);
		this.domElement.removeEventListener('pointermove', this._onPointerMoveListener);
		this.domElement.removeEventListener('pointerup', this._onPointerUpListener);
		this.domElement.removeEventListener('pointercancel', this._onPointerUpListener);

		this.domElement.removeEventListener('wheel', this._onMouseWheelListener);
		this.domElement.removeEventListener('contextmenu', this._onContextMenuListener);

		this.stopListenToKeyEvents();

		window.removeEventListener('keydown', this._interceptControlDownListener, { capture: true });

		this.domElement.style.touchAction = 'auto';
	}

	public dispose() {
		this.disconnect();
	}

	/**
	 * Get the current vertical rotation, in radians.
	 *
	 * @return The current vertical rotation, in radians.
	 */
	public getPolarAngle() {
		return this._spherical.phi;
	}

	/**
	 * Get the current horizontal rotation, in radians.
	 *
	 * @return The current horizontal rotation, in radians.
	 */
	public getAzimuthalAngle() {
		return this._spherical.theta;
	}

	/**
	 * Returns the distance from the camera to the target.
	 *
	 * @return The distance from the camera to the target.
	 */
	public getDistance() {
		return this.camera.position.distanceTo(this.target);
	}

	/**
	 * Adds key event listeners to the given DOM element.
	 * `window` is a recommended argument for using this method.
	 *
	 * @param domElement - The DOM element
	 */
	public listenToKeyEvents(domElement: HTMLElement) {
		domElement.addEventListener('keydown', this._onKeyDownListener);
		this._domElementKeyEvents = domElement;
	}

	/**
	 * Removes the key event listener previously defined with `listenToKeyEvents()`.
	 */
	public stopListenToKeyEvents() {
		if (this._domElementKeyEvents !== null) {
			this._domElementKeyEvents.removeEventListener('keydown', this._onKeyDownListener);
			this._domElementKeyEvents = null;
		}
	}

	/**
	 * @param deltaTime - The time since the last update in seconds.
	 */
	public update(deltaTime: number) {
		const position = this.camera.position;

		_v.copy(position).sub(this.target);

		// rotate offset to "y-axis-is-up" space
		_v.applyQuaternion(this._quat);

		// angle from z-axis around y-axis
		this._spherical.setFromVector3(_v);

		if (this.autoRotate && this.state === _STATE.NONE) {
			this._rotateLeft(this._getAutoRotationAngle(deltaTime));
		}

		let min = this.minAzimuthAngle;
		let max = this.maxAzimuthAngle;

		if (isFinite(min) && isFinite(max)) {
			if (min < -Math.PI) min += _twoPI;
			else if (min > Math.PI) min -= _twoPI;

			if (max < -Math.PI) max += _twoPI;
			else if (max > Math.PI) max -= _twoPI;

			if (min <= max) {
				this._spherical.theta = Math.max(min, Math.min(max, this._spherical.theta));
			} else {
				this._spherical.theta =
					this._spherical.theta > (min + max) / 2
						? Math.max(min, this._spherical.theta)
						: Math.min(max, this._spherical.theta);
			}
		}

		// Since we do integrations AFTER contraints, they will act as a spring effect.

		// restrict phi to be between desired limits
		this._spherical.phi = Math.max(
			this.minPolarAngle,
			Math.min(this.maxPolarAngle, this._spherical.phi)
		);

		// restrict theta to be between desired limits
		if (this.enableDamping) {
			this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor;
			this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor;
		} else {
			this._spherical.theta += this._sphericalDelta.theta;
			this._spherical.phi += this._sphericalDelta.phi;
		}

		this._spherical.makeSafe();

		this.target.sub(this.sceneCenter);
		this.target.applyAxisAngle(new Vector3(0, 1, 0), -this.targetYaw);
		this.target.clamp(this.minTarget, this.maxTarget);
		this.target.applyAxisAngle(new Vector3(0, 1, 0), this.targetYaw);
		this.target.add(this.sceneCenter);

		// move target to panned location

		if (this.enableDamping === true) {
			this.target.addScaledVector(this._panOffset, this.dampingFactor);
		} else {
			this.target.add(this._panOffset);
		}

		let zoomChanged = false;
		const zoomDampingFactor = this.enableDamping ? this.zoomDampingFactor : 1;

		const prevRadius = this._spherical.radius;
		this._spherical.radius = this._clampDistance(this._spherical.radius);
		this._scale =
			this._scaleDelta > 0
				? this._scale / (1 + this._scaleDelta * zoomDampingFactor)
				: this._scale * (1 - this._scaleDelta * zoomDampingFactor);
		this._spherical.radius = this._spherical.radius * this._scale;
		zoomChanged = Math.abs(prevRadius - this._spherical.radius) > _EPS * this.sceneSize;

		_v.setFromSpherical(this._spherical);

		// rotate offset back to "camera-up-vector-is-up" space
		_v.applyQuaternion(this._quatInverse);

		position.copy(this.target).add(_v);

		this.camera.lookAt(this.target);

		if (this.enableDamping === true) {
			this._sphericalDelta.theta *= 1 - this.dampingFactor;
			this._sphericalDelta.phi *= 1 - this.dampingFactor;

			this._scaleDelta *= 1 - zoomDampingFactor;

			this._panOffset.multiplyScalar(1 - this.dampingFactor);
		} else {
			this._sphericalDelta.set(0, 0, 0);

			this._scaleDelta = 0;

			this._panOffset.set(0, 0, 0);
		}

		this._scale = 1;

		// update condition is:
		// min(camera displacement, camera rotation in radians)^2 > EPS
		// using small-angle approximation cos(x/2) = 1 - x^2 / 8

		if (
			zoomChanged ||
			this._lastPosition.distanceToSquared(this.camera.position) > _EPS * this.sceneSize ||
			8 * (1 - this._lastQuaternion.dot(this.camera.quaternion)) > _EPS * this.sceneSize ||
			this._lastTargetPosition.distanceToSquared(this.target) > _EPS * this.sceneSize
		) {
			this.dispatchEvent(_changeEvent);

			this._lastPosition.copy(this.camera.position);
			this._lastQuaternion.copy(this.camera.quaternion);
			this._lastTargetPosition.copy(this.target);

			return true;
		}

		return false;
	}

	private _getAutoRotationAngle(deltaTime: number) {
		if (deltaTime !== null) {
			return (_twoPI / 60) * this.autoRotateSpeed * deltaTime;
		} else {
			return (_twoPI / 60 / 60) * this.autoRotateSpeed;
		}
	}

	private _getZoomScale(delta: number) {
		const normalizedDelta = Math.abs(delta * 0.01);
		return Math.pow(0.95, this.zoomSpeed * normalizedDelta);
	}

	private _rotateLeft(angle: number) {
		this._sphericalDelta.theta -= angle;
	}

	private _rotateUp(angle: number) {
		this._sphericalDelta.phi -= angle;
	}

	private _panLeft(distance: number, objectMatrix: Matrix4) {
		_v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
		_v.multiplyScalar(-distance);

		this._panOffset.add(_v);
	}

	private _panUp(distance: number, objectMatrix: Matrix4) {
		_v.setFromMatrixColumn(objectMatrix, 1);

		_v.multiplyScalar(distance);

		this._panOffset.add(_v);
	}

	// deltaX and deltaY are in pixels; right and down are positive
	private _pan(deltaX: number, deltaY: number) {
		const element = this.domElement;

		if (!element) {
			return;
		}

		// perspective
		const position = this.camera.position;
		_v.copy(position).sub(this.target);
		let targetDistance = _v.length();

		// half of the fov is center to top of screen
		targetDistance *= Math.tan(((this.camera.fov / 2) * Math.PI) / 180.0);

		// we use only clientHeight here so aspect ratio does not distort speed
		this._panLeft((2 * deltaX * targetDistance) / element.clientHeight, this.camera.matrix);
		this._panUp((2 * deltaY * targetDistance) / element.clientHeight, this.camera.matrix);
	}

	private _dollyOut(dollyScale: number) {
		this._scaleDelta -= dollyScale;
	}

	private _dollyIn(dollyScale: number) {
		this._scaleDelta += dollyScale;
	}

	private _clampDistance(dist: number) {
		return Math.max(this.minDistance, Math.min(this.maxDistance, dist));
	}

	//
	// event callbacks - update the object state
	//

	private _handleMouseDownRotate(event: MouseEvent) {
		this._rotateStart.set(event.clientX, event.clientY);
	}

	private _handleMouseDownDolly(event: MouseEvent) {
		this._dollyStart.set(event.clientX, event.clientY);
	}

	private _handleMouseDownPan(event: MouseEvent) {
		this._panStart.set(event.clientX, event.clientY);
	}

	private _handleMouseMoveRotate(event: MouseEvent) {
		const element = this.domElement;

		if (!element) {
			return;
		}

		this._rotateEnd.set(event.clientX, event.clientY);

		this._rotateDelta
			.subVectors(this._rotateEnd, this._rotateStart)
			.multiplyScalar(this.rotateSpeed);

		this._rotateLeft((_twoPI * this._rotateDelta.x) / element.clientHeight); // yes, height

		this._rotateUp((_twoPI * this._rotateDelta.y) / element.clientHeight);

		this._rotateStart.copy(this._rotateEnd);

		this.update(0);
	}

	private _handleMouseMoveDolly(event: MouseEvent) {
		this._dollyEnd.set(event.clientX, event.clientY);

		this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart);

		if (this._dollyDelta.y > 0) {
			this._dollyOut(this._getZoomScale(this._dollyDelta.y) * MOUSE_MOVE_DOLLY_FACTOR);
		} else if (this._dollyDelta.y < 0) {
			this._dollyIn(this._getZoomScale(this._dollyDelta.y) * MOUSE_MOVE_DOLLY_FACTOR);
		}

		this._dollyStart.copy(this._dollyEnd);

		this.update(0);
	}

	private _handleMouseMovePan(event: MouseEvent) {
		this._panEnd.set(event.clientX, event.clientY);

		this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed);

		this._pan(this._panDelta.x, this._panDelta.y);

		this._panStart.copy(this._panEnd);

		this.update(0);
	}

	private _handleMouseWheel(event: { deltaY: number }) {
		if (event.deltaY < 0) {
			this._dollyIn(this._getZoomScale(event.deltaY));
		} else if (event.deltaY > 0) {
			this._dollyOut(this._getZoomScale(event.deltaY));
		}

		this.update(0);
	}

	private _handleKeyDown(event: KeyboardEvent) {
		let needsUpdate = false;

		const element = this.domElement;
		if (!element) {
			return;
		}

		switch (event.code) {
			case this.keys.UP:
				if (event.ctrlKey || event.metaKey || event.shiftKey) {
					if (this.enableRotate) {
						this._rotateUp((_twoPI * this.keyRotateSpeed) / element.clientHeight);
					}
				} else {
					if (this.enablePan) {
						this._pan(0, this.keyPanSpeed);
					}
				}

				needsUpdate = true;
				break;

			case this.keys.BOTTOM:
				if (event.ctrlKey || event.metaKey || event.shiftKey) {
					if (this.enableRotate) {
						this._rotateUp((-_twoPI * this.keyRotateSpeed) / element.clientHeight);
					}
				} else {
					if (this.enablePan) {
						this._pan(0, -this.keyPanSpeed);
					}
				}

				needsUpdate = true;
				break;

			case this.keys.LEFT:
				if (event.ctrlKey || event.metaKey || event.shiftKey) {
					if (this.enableRotate) {
						this._rotateLeft((_twoPI * this.keyRotateSpeed) / element.clientHeight);
					}
				} else {
					if (this.enablePan) {
						this._pan(this.keyPanSpeed, 0);
					}
				}

				needsUpdate = true;
				break;

			case this.keys.RIGHT:
				if (event.ctrlKey || event.metaKey || event.shiftKey) {
					if (this.enableRotate) {
						this._rotateLeft((-_twoPI * this.keyRotateSpeed) / element.clientHeight);
					}
				} else {
					if (this.enablePan) {
						this._pan(-this.keyPanSpeed, 0);
					}
				}

				needsUpdate = true;
				break;
		}

		if (needsUpdate) {
			// prevent the browser from scrolling on cursor keys
			event.preventDefault();

			this.update(0);
		}
	}

	private _handleTouchStartRotate(event: { pointerId: number; pageX: number; pageY: number }) {
		if (this._pointers.length === 1) {
			this._rotateStart.set(event.pageX, event.pageY);
		} else {
			const position = this._getSecondPointerPosition(event);

			const x = 0.5 * (event.pageX + position.x);
			const y = 0.5 * (event.pageY + position.y);

			this._rotateStart.set(x, y);
		}
	}

	private _handleTouchStartPan(event: { pointerId: number; pageX: number; pageY: number }) {
		if (this._pointers.length === 1) {
			this._panStart.set(event.pageX, event.pageY);
		} else {
			const position = this._getSecondPointerPosition(event);

			const x = 0.5 * (event.pageX + position.x);
			const y = 0.5 * (event.pageY + position.y);

			this._panStart.set(x, y);
		}
	}

	private _handleTouchStartDolly(event: { pointerId: number; pageX: number; pageY: number }) {
		const position = this._getSecondPointerPosition(event);

		const dx = event.pageX - position.x;
		const dy = event.pageY - position.y;

		const distance = Math.sqrt(dx * dx + dy * dy);

		this._dollyStart.set(0, distance);
	}

	private _handleTouchStartDollyPan(event: { pointerId: number; pageX: number; pageY: number }) {
		if (this.enableZoom) this._handleTouchStartDolly(event);

		if (this.enablePan) this._handleTouchStartPan(event);
	}

	private _handleTouchStartDollyRotate(event: { pointerId: number; pageX: number; pageY: number }) {
		if (this.enableZoom) this._handleTouchStartDolly(event);

		if (this.enableRotate) this._handleTouchStartRotate(event);
	}

	private _handleTouchMoveRotate(event: { pointerId: number; pageX: number; pageY: number }) {
		if (this._pointers.length == 1) {
			this._rotateEnd.set(event.pageX, event.pageY);
		} else {
			const position = this._getSecondPointerPosition(event);

			const x = 0.5 * (event.pageX + position.x);
			const y = 0.5 * (event.pageY + position.y);

			this._rotateEnd.set(x, y);
		}

		this._rotateDelta
			.subVectors(this._rotateEnd, this._rotateStart)
			.multiplyScalar(this.rotateSpeed);

		const element = this.domElement;

		if (!element) {
			return;
		}

		this._rotateLeft((_twoPI * this._rotateDelta.x) / element.clientHeight); // yes, height

		this._rotateUp((_twoPI * this._rotateDelta.y) / element.clientHeight);

		this._rotateStart.copy(this._rotateEnd);
	}

	private _handleTouchMovePan(event: { pointerId: number; pageX: number; pageY: number }) {
		if (this._pointers.length === 1) {
			this._panEnd.set(event.pageX, event.pageY);
		} else {
			const position = this._getSecondPointerPosition(event);

			const x = 0.5 * (event.pageX + position.x);
			const y = 0.5 * (event.pageY + position.y);

			this._panEnd.set(x, y);
		}

		this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed);

		this._pan(this._panDelta.x, this._panDelta.y);

		this._panStart.copy(this._panEnd);
	}

	private _handleTouchMoveDolly(event: { pointerId: number; pageX: number; pageY: number }) {
		const position = this._getSecondPointerPosition(event);

		const dx = event.pageX - position.x;
		const dy = event.pageY - position.y;

		const distance = Math.sqrt(dx * dx + dy * dy);

		this._dollyEnd.set(0, distance);

		this._dollyDelta.set(0, (this._dollyEnd.y - this._dollyStart.y) / distance);

		this._dollyIn(this._dollyDelta.y);

		this._dollyStart.copy(this._dollyEnd);
	}

	private _handleTouchMoveDollyPan(event: { pointerId: number; pageX: number; pageY: number }) {
		if (this.enableZoom) this._handleTouchMoveDolly(event);

		if (this.enablePan) this._handleTouchMovePan(event);
	}

	private _handleTouchMoveDollyRotate(event: { pointerId: number; pageX: number; pageY: number }) {
		if (this.enableZoom) this._handleTouchMoveDolly(event);

		if (this.enableRotate) this._handleTouchMoveRotate(event);
	}

	// pointers

	private _addPointer(event: { pointerId: number }) {
		this._pointers.push(event.pointerId);
	}

	private _removePointer(event: { pointerId: number }) {
		delete this._pointerPositions[event.pointerId];

		for (let i = 0; i < this._pointers.length; i++) {
			if (this._pointers[i] == event.pointerId) {
				this._pointers.splice(i, 1);
				return;
			}
		}
	}

	private _isTrackingPointer(event: { pointerId: number }) {
		for (let i = 0; i < this._pointers.length; i++) {
			if (this._pointers[i] == event.pointerId) return true;
		}

		return false;
	}

	private _trackPointer(event: { pointerId: number; pageX: number; pageY: number }) {
		let position = this._pointerPositions[event.pointerId];

		if (position === undefined) {
			position = new Vector2();
			this._pointerPositions[event.pointerId] = position;
		}

		position.set(event.pageX, event.pageY);
	}

	private _getSecondPointerPosition(event: { pointerId: number; pageX: number; pageY: number }) {
		const pointerId = event.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];

		return this._pointerPositions[pointerId];
	}

	//

	private _customWheelEvent(event: WheelEvent) {
		const mode = event.deltaMode;

		// minimal wheel event altered to meet delta-zoom demand
		const newEvent = {
			clientX: event.clientX,
			clientY: event.clientY,
			deltaY: event.deltaY
		};

		switch (mode) {
			case 1: // LINE_MODE
				newEvent.deltaY *= 16;
				break;

			case 2: // PAGE_MODE
				newEvent.deltaY *= 100;
				break;
		}

		// detect if event was triggered by pinching
		if (event.ctrlKey && !this._controlActive) {
			newEvent.deltaY *= 10;
		}

		return newEvent;
	}

	private _onPointerDown = (event: PointerEvent) => {
		if (this._pointers.length === 0) {
			if (!this.domElement) {
				return;
			}

			this.domElement.setPointerCapture(event.pointerId);

			this.domElement.addEventListener('pointermove', this._onPointerMoveListener);
			this.domElement.addEventListener('pointerup', this._onPointerUpListener);
		}

		//

		if (this._isTrackingPointer(event)) return;

		//

		this._addPointer(event);

		if (event.pointerType === 'touch') {
			this._onTouchStart(event);
		} else {
			this._onMouseDown(event);
		}
	};

	private _onPointerMove(event: PointerEvent) {
		if (event.pointerType === 'touch') {
			this._onTouchMove(event);
		} else {
			this._onMouseMove(event);
		}
	}

	private _onPointerUp(event: PointerEvent) {
		this._removePointer(event);

		switch (this._pointers.length) {
			case 0:
				if (!this.domElement) {
					return;
				}

				this.domElement.releasePointerCapture(event.pointerId);

				this.domElement.removeEventListener('pointermove', this._onPointerMove);
				this.domElement.removeEventListener('pointerup', this._onPointerUp);

				this.dispatchEvent(_endEvent);

				this.state = _STATE.NONE;

				break;

			case 1: {
				const pointerId = this._pointers[0];
				const position = this._pointerPositions[pointerId];

				// minimal placeholder event - allows state correction on pointer-up
				this._onTouchStart({ pointerId: pointerId, pageX: position.x, pageY: position.y });

				break;
			}
		}
	}

	private _onMouseDown(event: MouseEvent) {
		let mouseAction;

		switch (event.button) {
			case 0:
				mouseAction = this.mouseButtons.LEFT;
				break;

			case 1:
				mouseAction = this.mouseButtons.MIDDLE;
				break;

			case 2:
				mouseAction = this.mouseButtons.RIGHT;
				break;

			default:
				mouseAction = -1;
		}

		switch (mouseAction) {
			case MOUSE.DOLLY:
				if (this.enableZoom === false) return;

				this._handleMouseDownDolly(event);

				this.state = _STATE.DOLLY;

				break;

			case MOUSE.ROTATE:
				if (event.ctrlKey || event.metaKey || event.shiftKey) {
					if (this.enablePan === false) return;

					this._handleMouseDownPan(event);

					this.state = _STATE.PAN;
				} else {
					if (this.enableRotate === false) return;

					this._handleMouseDownRotate(event);

					this.state = _STATE.ROTATE;
				}

				break;

			case MOUSE.PAN:
				if (event.ctrlKey || event.metaKey || event.shiftKey) {
					if (this.enableRotate === false) return;

					this._handleMouseDownRotate(event);

					this.state = _STATE.ROTATE;
				} else {
					if (this.enablePan === false) return;

					this._handleMouseDownPan(event);

					this.state = _STATE.PAN;
				}

				break;

			default:
				this.state = _STATE.NONE;
		}

		if (this.state !== _STATE.NONE) {
			this.dispatchEvent(_startEvent);
		}
	}

	private _onMouseMove(event: MouseEvent) {
		switch (this.state) {
			case _STATE.ROTATE:
				if (this.enableRotate === false) return;

				this._handleMouseMoveRotate(event);

				break;

			case _STATE.DOLLY:
				if (this.enableZoom === false) return;

				this._handleMouseMoveDolly(event);

				break;

			case _STATE.PAN:
				if (this.enablePan === false) return;

				this._handleMouseMovePan(event);

				break;
		}
	}

	private _onMouseWheel(event: WheelEvent) {
		if (this.enableZoom === false || (this.state !== _STATE.NONE && this.state !== _STATE.DOLLY))
			return;

		event.preventDefault();

		this.dispatchEvent(_startEvent);

		this._handleMouseWheel(this._customWheelEvent(event));

		this.dispatchEvent(_endEvent);
	}

	private _onKeyDown(event: KeyboardEvent) {
		this._handleKeyDown(event);
	}

	private _onTouchStart(event: { pointerId: number; pageX: number; pageY: number }) {
		this._trackPointer(event);

		switch (this._pointers.length) {
			case 1:
				switch (this.touches.ONE) {
					case TOUCH.ROTATE:
						if (this.enableRotate === false) return;

						this._handleTouchStartRotate(event);

						this.state = _STATE.TOUCH_ROTATE;

						break;

					case TOUCH.PAN:
						if (this.enablePan === false) return;

						this._handleTouchStartPan(event);

						this.state = _STATE.TOUCH_PAN;

						break;

					default:
						this.state = _STATE.NONE;
				}

				break;

			case 2:
				switch (this.touches.TWO) {
					case TOUCH.DOLLY_PAN:
						if (this.enableZoom === false && this.enablePan === false) return;

						this._handleTouchStartDollyPan(event);

						this.state = _STATE.TOUCH_DOLLY_PAN;

						break;

					case TOUCH.DOLLY_ROTATE:
						if (this.enableZoom === false && this.enableRotate === false) return;

						this._handleTouchStartDollyRotate(event);

						this.state = _STATE.TOUCH_DOLLY_ROTATE;

						break;

					default:
						this.state = _STATE.NONE;
				}

				break;

			default:
				this.state = _STATE.NONE;
		}

		if (this.state !== _STATE.NONE) {
			this.dispatchEvent(_startEvent);
		}
	}

	private _onTouchMove(event: { pointerId: number; pageX: number; pageY: number }) {
		this._trackPointer(event);

		switch (this.state) {
			case _STATE.TOUCH_ROTATE:
				if (this.enableRotate === false) return;

				this._handleTouchMoveRotate(event);

				this.update(0);

				break;

			case _STATE.TOUCH_PAN:
				if (this.enablePan === false) return;

				this._handleTouchMovePan(event);

				this.update(0);

				break;

			case _STATE.TOUCH_DOLLY_PAN:
				if (this.enableZoom === false && this.enablePan === false) return;

				this._handleTouchMoveDollyPan(event);

				this.update(0);

				break;

			case _STATE.TOUCH_DOLLY_ROTATE:
				if (this.enableZoom === false && this.enableRotate === false) return;

				this._handleTouchMoveDollyRotate(event);

				this.update(0);

				break;

			default:
				this.state = _STATE.NONE;
		}
	}

	private _onContextMenu(event: MouseEvent) {
		event.preventDefault();
	}

	private _interceptControlDown(event: KeyboardEvent) {
		if (event.key === 'Control') {
			this._controlActive = true;

			window.addEventListener('keyup', this._interceptControlUpListener, {
				passive: true,
				capture: true
			});
		}
	}

	private _interceptControlUp(event: KeyboardEvent) {
		if (event.key === 'Control') {
			this._controlActive = false;

			window.removeEventListener('keyup', this._interceptControlUpListener, {
				capture: true
			});
		}
	}
}

export { OrbitControls };
