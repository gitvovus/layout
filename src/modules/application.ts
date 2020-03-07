import { action, observable } from 'mobx';
import Vue from 'vue';
import AppView from '@/views/app-view.vue';

import { Controls } from '@/modules/controls';
import { ConvexView } from '@/modules/convex-view';
import { Movable } from '@/modules/movable';
import { SvgView } from '@/modules/svg-view';

enum Page {
  EMPTY,
  CONTROLS,
  SVG_VIEW,
  MOVABLES,
}

export class Application {
  @observable public page = Page.EMPTY;
  @observable public align = 0; // -1: left, 0: center, 1: right
  @observable public dialog = 2;

  public readonly convex = new ConvexView();
  public readonly controls = new Controls();
  public readonly svgView = new SvgView();

  @observable public readonly movable: Movable[] = [
    new Movable(new SvgView(), ['expanded']),
    new Movable(new SvgView(), [`i0`]),
    new Movable(new SvgView(), [`i1`]),
    new Movable(new SvgView(), [`i2`]),
  ];
  @observable public expanded = 0;

  private vue!: Vue;

  public run() {
    this.vue = new Vue({ render: h => h(AppView, { props: { model: this } }) });
    this.vue.$mount('#app');
  }

  @action public expand(index: number) {
    if (index === this.expanded) {
      return;
    }

    this.movable.forEach(item => {
      const i = item.classes.indexOf('collapsed');
      if (i !== -1) {
        item.classes.splice(i, 1);
      }
    });

    const itemToExpand = this.movable[index];
    const itemToCollapse = this.movable[this.expanded];

    itemToCollapse.classes = [...itemToExpand.classes, 'collapsed'];
    itemToExpand.classes = ['expanded'];

    this.expanded = index;
  }
}
