import { observable } from 'mobx';
import Vue from 'vue';
import App from '@/ui/app.vue';

export class Application {
  @observable public align = 0; // 0: center, 1: left, 2: right
  @observable public page = 2;
  @observable public show = false;
  @observable public test = true;
  @observable public dark = 0;
  @observable public lite = 0;
  @observable public views = true;

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
