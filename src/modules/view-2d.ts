import * as svg from '@/lib/svg';
import { toggleExpanded } from '@/modules/animations';
import { Camera } from '@/modules/view-2d-camera';
import { Controller } from '@/modules/view-2d-controller';
import source from '!!raw-loader!@/assets/overlay.svg';

export class View2d {
  public readonly root = svg.fromSource(source)!;

  private el!: HTMLElement;
  private camera = new Camera();
  private controller = new Controller(this.root, this.camera);

  public constructor() {
    this.controller.setReferenceSize(200, 200);
  }

  public mount(el: HTMLElement) {
    this.el = el;
    this.controller.mount(el);
  }

  public unmount() {
    this.el = undefined!;
    this.controller.unmount();
  }

  public toggleExpanded() {
    toggleExpanded(this.el, document.getElementById('views-wrapper') as HTMLElement, 0.3);
  }
}
