import { observable } from 'mobx';
import Vue from 'vue';
import App from '@/views/app.vue';

import { Controls } from '@/modules/controls';
import { SvgView } from '@/modules/svg-view';
import { View2d } from '@/modules/view-2d';
import { ViewConvex } from '@/modules/view-convex';

export class Application {
  @observable public page = 2;
  @observable public align = 0; // -1: left, 0: center, 1: right
  @observable public views = true;
  @observable public dark = 0;
  @observable public light = 0;
  @observable public showDialog = false;

  @observable public showConvex = false;
  public readonly convex = new ViewConvex();

  public readonly controls = [new Controls(), new Controls()];
  public readonly svgView = new SvgView();
  public readonly view2d = new View2d();

  private vue!: Vue;

  public run() {
    this.vue = new Vue({ render: (h) => h(App, { props: { model: this } }) });
    this.vue.$mount('#app');
  }

  public mount(el: Element) {
  }

  public unmount() {
  }
}
