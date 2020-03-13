import * as std from '@/lib/std';
import * as svg from '@/lib/svg';

import { Camera } from '@/modules/svg/camera';
import { Controller } from '@/modules/svg/controller';
import { Contour } from '@/modules/svg/contour';
import { ViewModel } from '@/modules/view-model';

import source from '!!raw-loader!@/assets/scene.svg';

export class SvgDemo implements ViewModel {
  public template = 'svg-demo-view';
  public readonly root = svg.fromSource(source)!;

  private readonly scene = this.root.findByClass('scene')!;
  private readonly contours = new svg.Item('g');
  private readonly camera = new Camera();
  private readonly controller = new Controller(this.root, this.camera);

  private pickableItems: Contour[] = [];
  private pickedItem!: Contour;
  private pickedPosition!: std.Vector2;
  private pickedOffset!: { x: number; y: number };
  private dragging = false;

  public constructor() {
    this.controller.setReferenceSize(4, 4);
    this.generate(this.scene);

    const w = window as any;
    w.p = (x: number, y: number) => (this.camera.position = new std.Vector2(x, y));
    w.r = (a: number) => (this.camera.rotation = a);
    w.s = (s: number) => (this.camera.scale = s);
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
    [-2, 2].forEach(cy => [-2, 2].forEach(cx => scene.add(new svg.Item('circle', { cx, cy, r: 0.1, fill: 'black' }))));
    [-1, 0, 1].forEach(i =>
      scene.add(
        new svg.Item('path', { d: `M-2 ${i}h4`, stroke: 'black', 'stroke-width': 0.003 }),
        new svg.Item('path', { d: `M${i} -2v4`, stroke: 'black', 'stroke-width': 0.003 }),
      ),
    );
    // scene.add(
    //   new svg.Item('path', { d: 'M1 0l-0.2 -0.1v0.2z', fill: '#c00000' }),
    //   new svg.Item('path', { d: 'M0 1l-0.1 -0.2h0.2z', fill: '#008000' }),
    //   this.contours,
    // );

    // scene rotation controls
    const delta = Math.PI / 12;
    const ox = new Contour({ fill: '#c00000' }, [
      { x: 1, y: 0 },
      { x: 0.8, y: -0.1 },
      { x: 0.8, y: 0.1 },
    ]);
    ox.on('pointerdown', (e: Event) => e.stopPropagation());
    ox.on('click', (e: Event) => {
      e.stopPropagation();
      this.rotate(delta);
    });
    ox.on('dblclick', (e: Event) => {
      e.stopPropagation();
      this.rotate(delta);
    });

    const oy = new Contour({ fill: '#008000' }, [
      { x: 0, y: 1 },
      { x: -0.1, y: 0.8 },
      { x: 0.1, y: 0.8 },
    ]);
    oy.on('pointerdown', (e: Event) => e.stopPropagation());
    oy.on('click', (e: Event) => {
      e.stopPropagation();
      this.rotate(-delta);
    });
    oy.on('dblclick', (e: Event) => {
      e.stopPropagation();
      this.rotate(-delta);
    });

    scene.add(ox, oy, this.contours);

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
      { fill: '#d01000c0', x: -0.25, y: -0.1 },
      { fill: '#109000c0', x: 0, y: 0 },
      { fill: '#0010d0c0', x: 0.25, y: 0.1 },
    ].forEach(({ fill, x, y }) => {
      const contour = new Contour({ fill, stroke: 'white', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, points);
      contour.offset = { x, y };
      this.unselect(contour);

      contour.on('dblclick', this.dblclick as EventListener);
      contour.on('pointerdown', this.pick as EventListener);
      contour.on('pointermove', this.drag as EventListener);
      contour.on('pointerup', this.drop as EventListener);

      this.contours.add(contour);
      this.pickableItems.push(contour);
    });
  }

  private select(item: Contour) {
    item.attributes['stroke-width'] = 0.01;
    item.index = -1;
  }

  private unselect(item: Contour) {
    item.attributes['stroke-width'] = 0;
  }

  private rotate(delta: number) {
    this.camera.rotation = std.mod(this.camera.rotation + delta, 2 * Math.PI);
  }

  private readonly pick = (e: PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    this.pickedItem = this.pickableItems.find(item => item.element === e.target) as Contour;
    this.pickedPosition = this.camera.transform.transform(this.controller.toCamera(e));
    this.pickedOffset = { ...this.pickedItem.offset };
    this.select(this.pickedItem);
    this.dragging = true;
  };

  private readonly drag = (e: PointerEvent) => {
    if (this.dragging) {
      e.stopPropagation();
      if (!this.pickedItem.element!.hasPointerCapture(e.pointerId)) {
        this.pickedItem.element!.setPointerCapture(e.pointerId);
      }
      const { x, y } = this.camera.transform.transform(this.controller.toCamera(e));
      const deltaX = x - this.pickedPosition.x;
      const deltaY = y - this.pickedPosition.y;
      this.pickedItem.offset = {
        x: this.pickedOffset.x + deltaX,
        y: this.pickedOffset.y + deltaY,
      };
    }
  };

  private readonly drop = (e: PointerEvent) => {
    if (this.dragging) {
      e.stopPropagation();
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      this.unselect(this.pickedItem);
      this.dragging = false;
    }
  };

  private readonly dblclick = (e: PointerEvent) => {
    e.stopPropagation();
    const item = this.pickableItems.find(item => item.element === e.target) as Contour;
    item.offset = { x: 0, y: 0 };
  };
}
