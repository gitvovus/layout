import { action, autorun, observable } from 'mobx';

import * as std from '@/lib/std';
import * as svg from '@/lib/svg';
import * as utils from '@/lib/utils';
import { Disposable } from '@/lib/reactive';

import { Camera } from '@/modules/svg/camera';

enum Gesture {
  NONE,
  DRAG,
  ROTATE,
}

export class Controller extends Disposable {
  @observable public width = 2;
  @observable public height = 2;
  @observable public referenceWidth = 2;
  @observable public referenceHeight = 2;
  private viewBox: svg.ViewBox = { left: -1, top: -1, width: 2, height: 2 };

  private element?: HTMLElement;
  private root: svg.Item;
  private scene: svg.Item;
  private camera: Camera;
  private defaultCamera: Camera;

  private gesture = Gesture.NONE;
  private pickedOffset = { x: 0, y: 0 };
  private pickedPoint = new std.Vector2(0, 0);
  private pickedPosition = new std.Vector2(0, 0);
  private pickedRotation = 0;
  private pickedTransform = new std.Matrix2x3(1, 0, 0, 1, 0, 0);

  public constructor(root: svg.Item, camera: Camera) {
    super();
    this.root = root;
    this.scene = root.findByClass('scene')!;
    this.camera = camera;
    this.defaultCamera = camera.clone();
  }

  public mount(element: HTMLElement) {
    this.element = element;
    this.addDisposers(
      utils.onElementEvent(element, 'dblclick', () => this.reset()),
      utils.onElementEvent(element, 'pointerdown', this.pick),
      utils.onElementEvent(element, 'pointermove', this.drag),
      utils.onElementEvent(element, 'pointerup', this.drop),
      utils.onElementEvent(element, 'wheel', this.wheel, { passive: false }),
      utils.onAnimationFrame(this.updateViewBox),
      autorun(() => (this.scene.attributes.transform = svg.toTransform(this.camera.inverseTransform))),
      () => (this.element = undefined),
    );
  }

  public unmount() {
    this.dispose();
  }

  @action public reset() {
    this.camera.position = this.defaultCamera.position;
    this.camera.rotation = this.defaultCamera.rotation;
    this.camera.scale = this.defaultCamera.scale;
  }

  @action public setReferenceSize(width: number, height: number) {
    this.referenceWidth = width;
    this.referenceHeight = height;
  }

  public toCamera(e: MouseEvent) {
    const { x, y } = utils.elementOffset(this.element!, e);
    return new std.Vector2(
      this.viewBox.left + (this.viewBox.width * x) / this.width,
      this.viewBox.top + (this.viewBox.height * y) / this.height,
    );
  }

  private readonly updateViewBox = () => {
    const width = this.element!.clientWidth;
    const height = this.element!.clientHeight;
    if (width === this.width && height === this.height) {
      return;
    }

    this.width = width;
    this.height = height;
    if (width === 0 || height === 0) {
      return;
    }

    const widthScale = width / this.referenceWidth;
    const heightScale = height / this.referenceHeight;
    let w, h;
    if (widthScale < heightScale) {
      w = this.referenceWidth;
      h = (this.referenceHeight * heightScale) / widthScale;
    } else {
      w = (this.referenceWidth * widthScale) / heightScale;
      h = this.referenceHeight;
    }
    this.viewBox = { left: -w / 2, top: -h / 2, width: w, height: h };
    this.root.attributes.viewBox = svg.toViewBox(this.viewBox);
  };

  private readonly pick = (e: PointerEvent) => {
    switch (e.button) {
      case 0:
        this.gesture = Gesture.DRAG;
        break;
      case 2:
        this.gesture = Gesture.ROTATE;
        break;
      default:
        return;
    }
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.pickedOffset = utils.elementOffset(this.element!, e);
    this.pickedPosition = this.camera.position;
    this.pickedRotation = this.camera.rotation;
    this.pickedTransform = this.camera.transform;
    this.pickedPoint = this.pickedTransform.transform(this.toCamera(e));
  };

  @action private readonly drag = (e: PointerEvent) => {
    if (this.gesture === Gesture.NONE) {
      return;
    }
    if (this.gesture === Gesture.DRAG) {
      const point = this.pickedTransform.transform(this.toCamera(e));
      const delta = new std.Vector2(point.x - this.pickedPoint.x, point.y - this.pickedPoint.y);
      this.camera.position = new std.Vector2(this.pickedPosition.x - delta.x, this.pickedPosition.y - delta.y);
    } else {
      const offset = utils.elementOffset(this.element!, e);
      const delta = (2 * Math.PI * (offset.x - this.pickedOffset.x)) / this.element!.clientWidth;
      this.camera.rotation = std.mod(this.pickedRotation - delta, 2 * Math.PI);
    }
  };

  private readonly drop = (e: PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    this.gesture = Gesture.NONE;
  };

  @action private readonly wheel = (e: WheelEvent) => {
    e.preventDefault();

    const k = e.deltaY < 0 ? 7 / 8 : 8 / 7;
    const zoom = std.clamp(Math.abs(this.camera.scale.x * k), 0.25, 4) / Math.abs(this.camera.scale.x);
    const newScale = new std.Vector2(this.camera.scale.x * zoom, this.camera.scale.y * zoom);

    const newCamera = new Camera({ position: this.camera.position, rotation: this.camera.rotation, scale: newScale });

    const cameraPos = this.toCamera(e);
    const oldPos = this.camera.transform.transform(cameraPos);
    const newPos = newCamera.transform.transform(cameraPos);

    this.camera.position = new std.Vector2(
      this.camera.position.x + oldPos.x - newPos.x,
      this.camera.position.y + oldPos.y - newPos.y,
    );
    this.camera.scale = newScale;
  };
}
