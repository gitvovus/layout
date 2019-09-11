import { action, computed, observable, reaction } from 'mobx';
import * as std from '@/lib/std';
import * as svg from '@/lib/svg';
import * as utils from '@/lib/utils';
import { Camera } from '@/modules/view-2d-camera';

function toSvgTransform(matrix: std.Matrix2x3) {
  const m = matrix.elements;
  return `matrix(${m.join(' ')})`;
}

export class Controller {
  @observable public width = 0;
  @observable public height = 0;
  @observable public referenceWidth = 1;
  @observable public referenceHeight = 1;

  private el!: HTMLElement;
  private root!: svg.Item;
  private scene!: svg.Item;
  private camera: Camera;

  private picked = { x: 0, y: 0 };
  private dragging = false;
  private readonly disposers: Array<() => void> = [];

  public constructor(root: svg.Item, camera: Camera) {
    this.root = root;
    this.scene = root.find('scene')!;
    this.camera = camera;
  }

  @action public reset = () => {
    this.camera.scale = new std.Vector2(1, 1);
    this.camera.position = new std.Vector2(0, 0);
  }

  @action public setReferenceSize(width: number, height: number) {
    this.referenceWidth = width;
    this.referenceHeight = height;
  }

  @computed public get viewBox() {
    return `${-this.width / 2} ${-this.height / 2} ${this.width} ${this.height}`;
  }

  @computed public get viewTransform() {
    return std.Matrix2x3.translation(new std.Vector2(this.width / 2, this.height / 2));
  }

  public mount(el: HTMLElement) {
    this.el = el;
    this.disposers.push(
      // utils.addElementEventListener(this.el, 'pointerdown', this.pick),
      // utils.addElementEventListener(this.el, 'pointermove', this.drag),
      // utils.addElementEventListener(this.el, 'pointerup', this.drop),
      // utils.addElementEventListener(this.el, 'wheel', this.wheel),
      this.trackResize(this.updateViewport),
      reaction(
        () => [this.referenceWidth, this.referenceHeight],
        this.updateViewport,
        { fireImmediately: true },
      ),
      reaction(
        () => this.camera.transform,
        this.updateScene,
        { fireImmediately: true },
      ),
    );
  }

  public unmount() {
    this.el = undefined!;
    this.disposers.forEach(disposer => disposer());
    this.disposers.length = 0;
  }

  // @action public zoom(x: number, y: number, k: number) {
  //   const dx = (x - this.offsetX) / this.scale;
  //   const dy = (y - this.offsetY) / this.scale;
  //   this.scale = std.clamp(this.scale * k, 0.25, 4);
  //   this.move(x - dx * this.scale, y - dy * this.scale);
  // }

  // @action public move(x: number, y: number) {
  //   this.offsetX = x;
  //   this.offsetY = y;
  // }

  private updateViewport = () => {
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
      h = this.referenceHeight * widthScale / heightScale;
    } else {
      w = this.referenceWidth * widthScale / heightScale;
      h = this.referenceHeight;
    }
    this.root.attributes.viewBox = `${-w / 2} ${-h / 2} ${w} ${h}`;
  }

  private updateScene = () => {
    this.scene.attributes.transform = toSvgTransform(this.camera.transform);
  }

  // private pick = (e: PointerEvent) => {
  //   if (e.buttons & 1) {
  //     e.stopPropagation();
  //     const [offsetX, offsetY] = utils.currentTargetOffset(e);
  //     this.picked.x = offsetX - this.offsetX;
  //     this.picked.y = offsetY - this.offsetY;
  //     this.dragging = true;
  //     this.el.setPointerCapture(e.pointerId);
  //   }
  // }

  // private drag = (e: PointerEvent) => {
  //   if (this.dragging) {
  //     const [offsetX, offsetY] = utils.currentTargetOffset(e);
  //     this.move(offsetX - this.picked.x, offsetY - this.picked.y);
  //   }
  // }

  // private drop = (e: PointerEvent) => {
  //   if (!(e.buttons & 1)) {
  //     this.dragging = false;
  //     this.el.releasePointerCapture(e.pointerId);
  //   }
  // }

  // private wheel = (e: WheelEvent) => {
  //   const k = Math.sign(e.deltaY) < 0 ? 1.1 : 1 / 1.1;
  //   const [offsetX, offsetY] = utils.currentTargetOffset(e);
  //   this.zoom(offsetX, offsetY, k);
  // }

  private trackResize = (callback: () => void) => {
    let track = 0;
    const frameHandler = () => {
      callback();
      track = window.requestAnimationFrame(frameHandler);
    };
    frameHandler();
    return () => window.cancelAnimationFrame(track);
  }
}
