import { computed, observable } from 'mobx';
import Vue from 'vue';

import { Controls } from '@/modules/controls';
import { ConvexDemo } from '@/modules/convex-demo';
import { EventTracker } from '@/modules/event-tracker';
import { MovableDemo } from '@/modules/movable-demo';
import { SvgDemo } from '@/modules/svg-demo';
import { ViewModel } from '@/modules/view-model';
import AppView from '@/views/app-view.vue';

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

  @observable public page = Page.SVG_DEMO;
  public readonly pages: (ViewModel | undefined)[] = [
    undefined,
    new Controls(),
    new EventTracker(),
    new SvgDemo(),
    new MovableDemo(),
  ];

  private readonly vue: Vue;

  public constructor() {
    this.vue = new Vue({ render: h => h(AppView, { props: { model: this } }) });
  }

  @computed public get activePage() {
    return this.pages[this.page];
  }

  public run() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    this.vue.$mount('#app');
  }
}
