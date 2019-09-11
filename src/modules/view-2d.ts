import * as svg from '@/lib/svg';
import { toggleExpanded } from '@/modules/animations';
import { Camera } from '@/modules/view-2d-camera';
import { Controller } from '@/modules/view-2d-controller';
import source from '!!raw-loader!@/assets/overlay.svg';

export class View2d {
  public readonly root = svg.fromSource(source)!;

  private el!: HTMLElement;
  private wrapper!: HTMLElement;
  private camera = new Camera();
  private controller = new Controller(this.root, this.camera);

  public constructor() {
    this.controller.setReferenceSize(200, 200);
  }

  public mount(el: HTMLElement) {
    this.el = el;
    let parent = el.parentElement;
    while (parent !== null) {
      if (parent.classList.contains('wrapper')) {
        this.wrapper = parent;
        break;
      }
      parent = parent.parentElement;
    }
    this.controller.mount(el);
  }

  public unmount() {
    this.el = undefined!;
    this.wrapper = undefined!;
    this.controller.unmount();
  }

  public toggleExpanded() {
    if (this.wrapper) {
      toggleExpanded(this.el, this.wrapper, 0.3);
    }
  }
}
