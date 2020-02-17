import { action } from 'mobx';

import * as std from '@/lib/std';
import * as svg from '@/lib/svg';
import * as utils from '@/lib/utils';
import { Camera } from '@/modules/view-2d-camera';
import { Controller } from '@/modules/view-2d-controller';
import { Contour } from '@/modules/svg/contour';
import source from '!!raw-loader!@/assets/scene.svg';

export class SvgView {
  public readonly root = svg.fromSource(source)!;

  private readonly scene = this.root.findByClass('scene')!;
  private readonly camera = new Camera();
  private readonly controller = new Controller(this.root, this.camera);

  private pickableItems: Contour[] = [];
  private pickedItem!: Contour;
  private pickedPosition!: std.Vector2;
  private pickedOffset!: { x: number, y: number };
  private dragging = false;

  public constructor() {
    this.controller.setReferenceSize(4, 4);
    this.generate(this.scene);

    const w = window as any;
    w.p = (x: number, y: number) => this.camera.position = new std.Vector2(x, y);
    w.r = (a: number) => this.camera.rotation = a;
    w.s = (s: number) => this.camera.scale = s;
  }

  public dispose() {
    this.pickableItems.forEach(item => item.dispose());
  }

  public mount(el: HTMLElement) {
    this.controller.mount(el);
  }

  public unmount() {
    this.controller.unmount();
  }

  private generate(scene: svg.Item) {
    // static scene items
    [-2, 2].forEach(cy => [-2, 2].forEach(cx => scene.items.push(new svg.Item('circle', { cx, cy, r: 0.1, fill: 'black' }))));
    [-1, 0, 1].forEach(i => scene.items.push(
      new svg.Item('path', { d: `M-2 ${i}h4`, stroke: 'black', 'stroke-width': 0.005 }),
      new svg.Item('path', { d: `M${i} -2v4`, stroke: 'black', 'stroke-width': 0.005 }),
    ));
    scene.items.push(
      new svg.Item('path', { d: 'M1 0l-0.2 -0.1v0.2z', fill: 'darkred' }),
      new svg.Item('path', { d: 'M0 1l-0.1 -0.2h0.2z', fill: 'darkgreen' }),
    );

    // dynamic scene items
    const contour = new Contour(
      { name: 'test-contour', fill: 'red', stroke: 'white', 'stroke-width': 0.01 },
      [
        { x: 0.5, y: 0.1 },
        { x: 0.1, y: 0.1 },
        { x: 0.1, y: 0.5 },
        { x: -0.1, y: 0.5 },
        { x: -0.1, y: 0.1 },
        { x: -0.5, y: 0.1 },
        { x: -0.5, y: -0.1 },
        { x: -0.1, y: -0.1 },
        { x: -0.1, y: -0.5 },
        { x: 0.1, y: -0.5 },
        { x: 0.1, y: -0.1 },
        { x: 0.5, y: -0.1 },
      ],
    );

    contour.on('pointerdown', this.pick as EventListener);
    contour.on('pointermove', this.drag as EventListener);
    contour.on('pointerup', this.drop as EventListener);
    contour.on('dblclick', this.dblclick as EventListener);

    scene.items.push(contour);
    this.pickableItems.push(contour);
  }

  private readonly pick = (e: PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    this.pickedItem = this.pickableItems.find(item => item.element === e.target) as Contour;
    this.pickedPosition = this.camera.transform.transform(this.controller.toCamera(e));
    this.pickedOffset = { ...this.pickedItem.offset };
    this.dragging = true;
  }

  private readonly drag = (e: PointerEvent) => {
    if (this.dragging) {
      e.stopPropagation();
      const { x, y } = this.camera.transform.transform(this.controller.toCamera(e));
      const deltaX = x - this.pickedPosition.x;
      const deltaY = y - this.pickedPosition.y;
      this.pickedItem.offset = { x: this.pickedOffset.x + deltaX, y: this.pickedOffset.y + deltaY };
    }
  }

  private readonly drop = (e: PointerEvent) => {
    if (this.dragging) {
      e.stopPropagation();
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      this.dragging = false;
    }
  }

  private readonly dblclick = (e: PointerEvent) => {
    e.stopPropagation();
    const item = this.pickableItems.find(item => item.element === e.target) as Contour;
    item.offset = { x: 0, y: 0 };
  }
}
