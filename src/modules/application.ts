import { action, observable } from 'mobx';
import Vue from 'vue';
import AppView from '@/views/app-view.vue';

import { Controls } from '@/modules/controls';
import { ConvexView } from '@/modules/convex-view';
import { Movable } from '@/modules/movable';
import { SvgView } from '@/modules/svg-view';

export class Application {
  @observable public page = 1;
  @observable public align = 0; // -1: left, 0: center, 1: right
  @observable public dialog = 0;

  public readonly convex = new ConvexView();
  public readonly controls = [new Controls(), new Controls()];
  public readonly svgView = new SvgView();

  @observable public readonly movable: Movable[] = [];
  @observable public expanded = 0;

  private vue!: Vue;

  public constructor() {
    this.movable.push(
      new Movable(-1, new SvgView(), {
        left: '30%',
        top: '0',
        width: '70%',
        height: '100%',
      }),
    );
    for (let i = 0; i < 3; ++i) {
      this.movable.push(
        new Movable(i, new SvgView(), {
          left: '0',
          top: `${(i * 100) / 3}%`,
          width: '30%',
          height: `${100 / 3}%`,
        }),
      );
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

    const itemToExpand = this.movable[index];
    itemToExpand.attributes = {
      left: '30%',
      top: '0',
      width: '70%',
      height: '100%',
      zIndex: 2,
    };

    const itemToCollapse = this.movable[this.expanded];
    itemToCollapse.attributes = {
      left: '0',
      top: `${(itemToExpand.position * 100) / 3}%`,
      width: '30%',
      height: `${100 / 3}%`,
      zIndex: 0,
    };

    this.movable.forEach(item => {
      if (item !== itemToExpand && item !== itemToCollapse) {
        item.attributes = { ...item.attributes, zIndex: 1 };
      }
    });

    itemToCollapse.position = itemToExpand.position;
    itemToExpand.position = -1;
    this.expanded = index;
  }
}
