import { observable } from 'mobx';
import Vue from 'vue';
import AppView from '@/views/app-view.vue';

import { Controls } from '@/modules/controls';
import { ConvexDemo } from '@/modules/convex-demo';
import { EventTracker } from '@/modules/event-tracker';
import { MovableDemo } from '@/modules/movable-demo';
import { SvgDemo } from '@/modules/svg-demo';
import { ViewModel } from '@/modules/view-model';

enum Page {
  EMPTY,
  CONTROLS,
  EVENT_TRACKER,
  SVG_DEMO,
  MOVABLES,
}

export class Application {
  @observable public align = 0; // -1: left, 0: center, 1: right
  @observable public dialog: number | undefined = undefined;
  public readonly convex = new ConvexDemo();

  @observable public page = Page.EMPTY;
  public readonly pages: (ViewModel | undefined)[] = [
    undefined,
    new Controls(),
    new EventTracker(),
    new SvgDemo(),
    new MovableDemo(),
  ];

  private vue!: Vue;

  public run() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    this.vue = new Vue({ render: h => h(AppView, { props: { model: this } }) });
    this.vue.$mount('#app');
  }
}
