import { observable } from 'mobx';
import Vue from 'vue';
import App from '@/views/app.vue';

import { Controls } from '@/modules/controls';
import { Grid } from '@/modules/grid';
import { View2d } from '@/modules/view-2d';

export class Application {
  @observable public page = 0;
  @observable public align = 0; // -1: left, 0: center, 1: right
  @observable public show = false;
  @observable public dark = 0;
  @observable public lite = 0;
  @observable public views = true;

  public readonly controls = new Controls();
  public readonly grid = new Grid();
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
