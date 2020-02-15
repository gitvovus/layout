import * as std from '@/lib/std';
import * as svg from '@/lib/svg';
import { Camera } from '@/modules/view-2d-camera';
import { Controller } from '@/modules/view-2d-controller';
import source from '!!raw-loader!@/assets/scene.svg';

export class SvgView {
  public readonly root = svg.fromSource(source)!;

  private readonly scene = this.root.findByClass('scene')!;
  private readonly camera = new Camera();
  private readonly controller = new Controller(this.root, this.camera);

  public constructor() {
    this.controller.setReferenceSize(2, 2);
    this.generate(this.scene);

    const w = window as any;
    w.p = (x: number, y: number) => this.camera.position = new std.Vector2(x, y);
    w.r = (a: number) => this.camera.rotation = a;
    w.s = (s: number) => this.camera.scale = s;
  }

  public click(e: Event) {
    console.log('click', e);
  }

  public mount(el: HTMLElement) {
    this.controller.mount(el);
  }

  public unmount() {
    this.controller.unmount();
  }

  private generate(scene: svg.Item) {
    [-1, 0, 1].forEach(cy => [-1, 0, 1].forEach(cx => scene.items.push(new svg.Item('circle', { cx, cy, r: 0.1, fill: 'black' }))));
    scene.items.push(
      new svg.Item('path', { d: 'M1 0l-0.2 -0.1v0.2z', fill: 'darkred' }),
      new svg.Item('path', { d: 'M0 1l-0.1 -0.2h0.2z', fill: 'darkgreen' }),
    );
  }
}
