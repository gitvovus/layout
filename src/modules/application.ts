import { observable } from 'mobx';
import Vue from 'vue';
import AppView from '@/views/app-view.vue';

import { Controls } from '@/modules/controls';
import { Mockup } from '@/modules/mockup';
import { SvgView } from '@/modules/svg-view';
import { ConvexView } from '@/modules/convex-view';

export class Application {
  @observable public page = 2;
  @observable public align = 0; // -1: left, 0: center, 1: right
  @observable public dialog = 0;

  public readonly convex = new ConvexView();
  public readonly controls = [new Controls(), new Controls()];
  public readonly mockup = new Mockup();
  public readonly svgView = new SvgView();

  private vue!: Vue;

  public run() {
    this.vue = new Vue({ render: h => h(AppView, { props: { model: this } }) });
    this.vue.$mount('#app');
  }

  public mount(el: Element) {}

  public unmount() {}
}
