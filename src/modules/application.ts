import { action, observable } from 'mobx';
import Vue from 'vue';
import AppView from '@/views/app-view.vue';

import { Controls } from '@/modules/controls';
import { ConvexView } from '@/modules/convex-view';
import { Movable } from '@/modules/movable';
import { SvgView } from '@/modules/svg-view';

export class Application {
  @observable public page = 3;
  @observable public align = 0; // -1: left, 0: center, 1: right
  @observable public dialog = 0;

  public readonly convex = new ConvexView();
  public readonly controls = [new Controls(), new Controls()];
  public readonly svgView = new SvgView();

  @observable public readonly movable: Movable[] = [];
  @observable public expanded = 0;

  private vue!: Vue;

  public constructor() {
    this.movable.push(new Movable(new SvgView(), ['expanded']));
    for (let i = 0; i < 3; ++i) {
      this.movable.push(new Movable(new SvgView(), [`i${i}`]));
    }
  }

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
