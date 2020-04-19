import * as std from '@/lib/std';
import * as svg from '@/lib/svg';
import * as utils from '@/lib/utils';
import { Disposable } from '@/lib/reactive';

import { Camera } from '@/modules/svg/camera';
import { Controller } from '@/modules/svg/controller';
import { Contour } from '@/modules/svg/contour';
import { ViewModel } from '@/modules/view-model';

import source from '!!raw-loader!@/assets/scene.svg';

enum Gesture {
  NONE,
  DRAG,
  ROTATE,
}

export class SvgDemo extends Disposable implements ViewModel {
  public readonly template = 'svg-demo-view';
  public readonly root = svg.fromSource(source)!;

  private element?: HTMLElement;
  private readonly scene = this.root.findByClass('scene')!;
  private readonly contours = new svg.Item('g');
  private readonly camera = new Camera({ scale: new std.Vector2(1, -1) });
  private readonly controller = new Controller(this.root, this.camera);

  private pickableItems: Contour[] = [];

  private gesture = Gesture.NONE;
  private pickedOffset!: { x: number; y: number };
  private pickedPoint!: std.Vector2;
  private pickedItem!: Contour;
  private pickedPosition!: std.Vector2;
  private pickedRotation!: number;

  public constructor() {
    super();
    this.controller.setReferenceSize(4, 4);
    this.generate(this.scene);
    this.addDisposers(() => this.pickableItems.forEach(item => item.dispose()));
  }

  public mount(element: HTMLElement) {
    this.element = element;
    this.controller.mount(element);
  }

  public unmount() {
    this.element = undefined;
    this.controller.unmount();
  }

  private generate(scene: svg.Item) {
    // static scene items
    [-2, 2].forEach(cy =>
      [-2, 2].forEach(cx =>
        scene.add(
          new svg.Item('circle', {
            cx,
            cy,
            r: 0.1,
            fill: 'white',
            stroke: 'black',
            'stroke-width': 0.5,
            'vector-effect': 'non-scaling-stroke',
          }),
        ),
      ),
    );

    [-1, 0, 1].forEach(i =>
      scene.add(
        new svg.Item('path', { d: `M-2 ${i}h4`, stroke: 'black', 'stroke-width': 0.5, 'vector-effect': 'non-scaling-stroke' }),
        new svg.Item('path', { d: `M${i} -2v4`, stroke: 'black', 'stroke-width': 0.5, 'vector-effect': 'non-scaling-stroke' }),
      ),
    );

    [
      ['M1 0l-0.2 -0.1v0.2z', '#d00000'],
      ['M0 1l-0.1 -0.2h0.2z', '#00a000'],
    ].forEach(([d, fill]) =>
      scene.add(
        new svg.Item('path', {
          d,
          fill,
          stroke: 'black',
          'stroke-width': 0.5,
          'vector-effect': 'non-scaling-stroke',
        }),
      ),
    );

    scene.add(this.contours);

    // dynamic scene items
    const points: std.Point[] = [
      { x: 0.4, y: 0.1 },
      { x: 0.1, y: 0.1 },
      { x: 0.1, y: 0.4 },
      { x: -0.1, y: 0.4 },
      { x: -0.1, y: 0.1 },
      { x: -0.4, y: 0.1 },
      { x: -0.4, y: -0.1 },
      { x: -0.1, y: -0.1 },
      { x: -0.1, y: -0.4 },
      { x: 0.1, y: -0.4 },
      { x: 0.1, y: -0.1 },
      { x: 0.4, y: -0.1 },
    ];

    [
      { fill: '#f00000c0', x: -0.25, y: -0.1 },
      { fill: '#00b000c0', x: 0, y: 0 },
      { fill: '#1010ffc0', x: 0.25, y: 0.1 },
    ].forEach(({ fill, x, y }) => {
      const contour = new Contour(
        { fill, stroke: 'black', 'stroke-width': 0.01, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
        points,
      );
      contour.position = new std.Vector2(x, y);
      this.unselect(contour);

      contour.on('dblclick', this.dblclick);
      contour.on('pointerdown', this.pick);
      contour.on('pointermove', this.drag);
      contour.on('pointerup', this.drop);
      contour.on('wheel', this.wheel);

      this.contours.add(contour);
      this.pickableItems.push(contour);
    });
  }

  private select(item: Contour, brignOnTop: boolean) {
    item.attributes['stroke'] = 'white';
    if (brignOnTop) {
      item.index = -1;
    }
  }

  private unselect(item: Contour) {
    item.attributes['stroke'] = 'black';
  }

  private readonly pick = (e: PointerEvent) => {
    if (e.ctrlKey) {
      return;
    }
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
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    this.pickedOffset = utils.elementOffset(this.element!, e);
    this.pickedPoint = this.camera.transform.transform(this.controller.toCamera(e));
    this.pickedItem = this.pickableItems.find(item => item.element === e.target) as Contour;
    this.pickedPosition = this.pickedItem.position;
    this.pickedRotation = this.pickedItem.rotation;

    this.select(this.pickedItem, !e.shiftKey);
  };

  private readonly drag = (e: PointerEvent) => {
    if (this.gesture === Gesture.NONE) {
      return;
    }

    e.stopPropagation();
    if (!this.pickedItem.element!.hasPointerCapture(e.pointerId)) {
      this.pickedItem.element!.setPointerCapture(e.pointerId);
    }

    if (this.gesture === Gesture.DRAG) {
      const point = this.camera.transform.transform(this.controller.toCamera(e));
      const delta = new std.Vector2(point.x - this.pickedPoint.x, point.y - this.pickedPoint.y);
      this.pickedItem.position = new std.Vector2(this.pickedPosition.x + delta.x, this.pickedPosition.y + delta.y);
    } else {
      const offset = utils.elementOffset(this.element!, e);
      const delta = (2 * Math.PI * (offset.x - this.pickedOffset.x)) / this.element!.clientWidth;
      this.pickedItem.rotation = std.mod(this.pickedRotation + delta, 2 * Math.PI);
    }
  };

  private readonly drop = (e: PointerEvent) => {
    if (this.gesture !== Gesture.NONE) {
      e.stopPropagation();
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      this.unselect(this.pickedItem);
      this.gesture = Gesture.NONE;
    }
  };

  private readonly wheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      return;
    }
    e.stopPropagation();
    const k = e.deltaY > 0 ? 7 / 8 : 8 / 7;
    const item = this.pickableItems.find(item => item.element === e.target)!;
    item.scale = std.clamp(item.scale * k, 0.25, 4);
  };

  private readonly dblclick = (e: MouseEvent) => {
    e.stopPropagation();
    const item = this.pickableItems.find(item => item.element === e.target)!;
    item.position = new std.Vector2(0, 0);
  };
}
