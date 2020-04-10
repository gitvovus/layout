import * as three from 'three';

import { clamp } from '@/lib/std';
import * as utils from '@/lib/utils';
import { Disposable } from '@/lib/reactive';

export interface Options {
  phi: number;
  theta: number;
  radius: number;
  lookAt: three.Vector3;
  zoom: number;
  minRadius: number;
  maxRadius: number;
  movementSpeed: number;
  rotationSpeed: number;
}

export class Controller extends Disposable {
  public lookAt = new three.Vector3(0, 0, 0);
  public radius = 6;
  public phi = 0;
  public theta = 0;
  public zoom = 1;

  public minRadius = 2;
  public maxRadius = 10;
  public movementSpeed = 10;
  public rotationSpeed = 1;

  private element!: HTMLElement;

  private minTheta = -1.5;
  private maxTheta = 1.5;
  private movement = 0;
  private phiRotation = 0;
  private thetaRotation = 0;

  private initializer: Partial<Options> = {};
  private lastUpdate = Date.now() * 0.001;
  private trackPointer = false;
  private pointer = { x: 0, y: 0 };
  private panX = new three.Vector3();
  private panY = new three.Vector3();

  public constructor(initializer?: Partial<Options>) {
    super();
    Object.assign(this, initializer);
    Object.assign(this.initializer, {
      phi: this.phi,
      theta: this.theta,
      radius: this.radius,
      lookAt: this.lookAt.clone(),
      zoom: this.zoom,
      minRadius: this.minRadius,
      maxRadius: this.maxRadius,
      movementSpeed: this.movementSpeed,
      rotationSpeed: this.rotationSpeed,
    });
  }

  public update(camera: three.Camera) {
    const time = Date.now() * 0.001;
    const dt = time - this.lastUpdate;
    this.lastUpdate = time;

    this.radius += dt * this.movement * this.movementSpeed;
    this.phi += dt * this.phiRotation * this.rotationSpeed;
    this.theta += dt * this.thetaRotation * this.rotationSpeed;

    this.radius = clamp(this.radius, this.minRadius, this.maxRadius);
    this.theta = clamp(this.theta, this.minTheta, this.maxTheta);

    const x = this.lookAt.x + this.radius * Math.cos(this.phi) * Math.cos(this.theta);
    const y = this.lookAt.y + this.radius * Math.sin(this.phi) * Math.cos(this.theta);
    const z = this.lookAt.z + this.radius * Math.sin(this.theta);

    camera.position.set(x, y, z);
    camera.lookAt(this.lookAt);
  }

  public mount(element: HTMLElement) {
    this.element = element;
    this.addDisposers(
      utils.onElementEvent(element, 'pointerdown', this.pick),
      utils.onElementEvent(element, 'pointermove', this.drag),
      utils.onElementEvent(element, 'pointerup', this.drop),
      utils.onElementEvent(element, 'wheel', this.wheel, { passive: false }),
      utils.onElementEvent(element, 'keydown', this.keyDown),
      utils.onElementEvent(element, 'keyup', this.keyUp),
    );
  }

  public unmount() {
    this.dispose();
    this.element = undefined!;
  }

  private readonly keyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
        this.movement = -1;
        break;
      case 'KeyS':
        this.movement = 1;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.phiRotation = -1;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.phiRotation = 1;
        break;
      case 'KeyE':
      case 'ArrowUp':
        this.thetaRotation = 1;
        break;
      case 'KeyQ':
      case 'ArrowDown':
        this.thetaRotation = -1;
        break;
      case 'Home':
        Object.assign(this, this.initializer);
        break;
      case 'End':
        this.phi = -Math.PI / 2;
        this.theta = 0;
        break;
      default:
        return;
    }
    e.stopImmediatePropagation();
    e.preventDefault();
  };

  private readonly keyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
        this.movement = 0;
        break;
      case 'KeyS':
        this.movement = 0;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.phiRotation = 0;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.phiRotation = 0;
        break;
      case 'KeyE':
      case 'ArrowUp':
        this.thetaRotation = 0;
        break;
      case 'KeyQ':
      case 'ArrowDown':
        this.thetaRotation = 0;
        break;
      default:
        return;
    }
    e.stopImmediatePropagation();
    e.preventDefault();
  };

  private readonly pick = (e: PointerEvent) => {
    if (!(e.buttons & 3) || this.trackPointer) {
      return;
    }

    const cosPhi = Math.cos(this.phi);
    const sinPhi = Math.sin(this.phi);
    const cosTheta = Math.cos(this.theta);
    const sinTheta = Math.sin(this.theta);
    this.panX.set(-sinPhi, cosPhi, 0).multiplyScalar(this.radius);
    this.panY.set(-cosPhi * sinTheta, -sinPhi * sinTheta, cosTheta).multiplyScalar(this.radius);

    this.trackPointer = true;
    const { x, y } = utils.elementOffset(this.element, e);
    this.pointer.x = x;
    this.pointer.y = y;
    this.element.setPointerCapture(e.pointerId);
  };

  private readonly drag = (e: PointerEvent) => {
    if (!this.trackPointer) {
      return;
    }

    const { x, y } = utils.elementOffset(this.element, e);
    const dx = x - this.pointer.x;
    const dy = y - this.pointer.y;
    this.pointer.x = x;
    this.pointer.y = y;

    if (e.buttons & 1) {
      this.phi -= (dx * 2 * Math.PI * this.rotationSpeed) / this.element.clientWidth;
      this.theta += (dy * 2 * Math.PI * this.rotationSpeed) / this.element.clientHeight;
    } else if (e.buttons & 2) {
      const delta = this.panX
        .clone()
        .multiplyScalar(dx / this.element.clientWidth)
        .add(this.panY.clone().multiplyScalar(-dy / this.element.clientHeight));
      this.lookAt.sub(delta);
    }
  };

  private readonly drop = (e: PointerEvent) => {
    if (this.trackPointer && !(e.buttons & 3)) {
      this.element.releasePointerCapture(e.pointerId);
      this.trackPointer = false;
    }
  };

  private readonly wheel = (e: WheelEvent) => {
    const dy = e.deltaY > 0 ? 1 : -1;
    this.radius += 0.05 * dy * this.movementSpeed;
    e.stopPropagation();
    e.preventDefault();
  };
}
