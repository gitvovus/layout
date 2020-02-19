import { action, observable, reaction } from 'mobx';

import * as std from '@/lib/std';
import * as svg from '@/lib/svg';
import * as utils from '@/lib/utils';

import { Camera } from '@/modules/view-2d-camera';

const scale = std.Matrix2x3.scale;

function toSvg(matrix: std.Matrix2x3) {
  return `matrix(${matrix.elements.join(' ')})`;
}

export class Controller {
  @observable public width = 2;
  @observable public height = 2;
  @observable public referenceWidth = 2;
  @observable public referenceHeight = 2;
  private viewBox = { left: -1, bottom: -1, width: 2, height: 2 };

  private el!: HTMLElement;
  private root!: svg.Item;
  private scene!: svg.Item;
  private camera: Camera;

  private pickedPoint = new std.Vector2(0, 0);
  private pickedPosition = new std.Vector2(0, 0);
  private pickedTransform = new std.Matrix2x3(1, 0, 0, 1, 0, 0);
  private dragging = false;
  private readonly disposers: Array<() => void> = [];

  public constructor(root: svg.Item, camera: Camera) {
    this.root = root;
    this.scene = root.findByClass('scene')!;
    this.camera = camera;
  }

  public mount(el: HTMLElement) {
    this.el = el;
    this.disposers.push(
      utils.onElementEvent(this.el, 'dblclick', this.dblclick),
      utils.onElementEvent(this.el, 'pointerdown', this.pick),
      utils.onElementEvent(this.el, 'pointermove', this.drag),
      utils.onElementEvent(this.el, 'pointerup', this.drop),
      utils.onElementEvent(this.el, 'wheel', this.wheel),
      this.trackResize(this.updateViewBox),
      reaction(() => [this.referenceWidth, this.referenceHeight], this.updateViewBox, { fireImmediately: true }),
      reaction(() => this.camera.inverseTransform, this.updateSceneTransform, {
        fireImmediately: true,
      }),
    );
  }

  public unmount() {
    this.el = undefined!;
    this.disposers.forEach(disposer => disposer());
    this.disposers.length = 0;
  }

  @action public reset = () => {
    this.camera.position = new std.Vector2(0, 0);
    this.camera.rotation = 0;
    this.camera.scale = 1;
  };

  @action public setReferenceSize(width: number, height: number) {
    this.referenceWidth = width;
    this.referenceHeight = height;
  }

  public toCamera(e: MouseEvent) {
    const { x, y } = utils.elementOffset(this.el, e);
    return new std.Vector2(
      this.viewBox.left + (this.viewBox.width * x) / this.width,
      this.viewBox.bottom + (this.viewBox.height * (this.height - y)) / this.height,
    );
  }

  private readonly updateViewBox = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;
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
    this.viewBox = {
      left: -w / 2,
      bottom: -h / 2,
      width: w,
      height: h,
    };
    this.root.attributes.viewBox = `${-w / 2} ${-h / 2} ${w} ${h}`;
  };

  private readonly updateSceneTransform = (transform: std.Matrix2x3) => {
    this.scene.attributes.transform = toSvg(scale(1, -1).multiply(transform));
  };

  private readonly trackResize = (callback: () => void) => {
    let track = 0;
    const frameHandler = () => {
      callback();
      track = window.requestAnimationFrame(frameHandler);
    };
    frameHandler();
    return () => window.cancelAnimationFrame(track);
  };

  private readonly pick = (e: PointerEvent) => {
    this.pickedPosition = this.camera.position;
    this.pickedTransform = this.camera.transform;
    this.pickedPoint = this.pickedTransform.transform(this.toCamera(e));
    this.dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  @action private readonly drag = (e: PointerEvent) => {
    if (this.dragging) {
      const point = this.pickedTransform.transform(this.toCamera(e));
      const delta = new std.Vector2(point.x - this.pickedPoint.x, point.y - this.pickedPoint.y);
      this.camera.position = new std.Vector2(this.pickedPosition.x - delta.x, this.pickedPosition.y - delta.y);
    }
  };

  private readonly drop = (e: PointerEvent) => {
    this.dragging = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  @action private readonly wheel = (e: WheelEvent) => {
    const k = e.deltaY < 0 ? 1 / 1.1 : 1.1;
    const oldScale = this.camera.scale;
    const newScale = std.clamp(oldScale * k, 0.25, 4);

    const newCamera = new Camera();
    newCamera.position = this.camera.position;
    newCamera.rotation = this.camera.rotation;
    newCamera.scale = newScale;

    const cameraPos = this.toCamera(e);
    const oldPos = this.camera.transform.transform(cameraPos);
    const newPos = newCamera.transform.transform(cameraPos);

    this.camera.position = new std.Vector2(
      this.camera.position.x + oldPos.x - newPos.x,
      this.camera.position.y + oldPos.y - newPos.y,
    );
    this.camera.scale = newScale;
  };

  private readonly dblclick = (e: MouseEvent) => {
    this.reset();
  };
}
