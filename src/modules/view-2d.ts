import { observable } from 'mobx';

import * as svg from '@/lib/svg';
import { toggleExpanded } from '@/modules/animations';
import { Controller } from '@/modules/view-2d-controller';
import source from '!!raw-loader!@/assets/overlay.svg';

export class View2d {
  @observable public root = svg.fromSource(source)!;

  private controller = new Controller(this.root);
  private el!: HTMLElement;

  public mount(el: HTMLElement) {
    this.el = el;
    this.controller.mount(el.getElementsByClassName('overlay')[0] as HTMLElement);
  }

  public unmount() {
    this.controller.unmount();
  }

  public toggleExpanded() {
    toggleExpanded(this.el, document.getElementById('views-wrapper') as HTMLElement, 0.3).then(() => this.controller.resize());
  }
}
