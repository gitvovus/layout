import { computed, observable } from 'mobx';
import Vue from 'vue';

import AppView from '@/views/app-view.vue';

import { Controls } from '@/modules/controls';
import { ConvexDemo } from '@/modules/convex-demo';
import { EventTracker } from '@/modules/event-tracker';
import { MovableDemo } from '@/modules/movable-demo';
import { SceneDemo } from '@/modules/scene-demo';
import { SvgDemo } from '@/modules/svg-demo';
import { SvgDrawing } from '@/modules/svg-drawing';
import { ViewModel } from '@/modules/view-model';

enum Page {
  EMPTY,
  CONTROLS,
  EVENT_TRACKER,
  SVG_DRAWING,
  SVG_DEMO,
  SCENE_DEMO,
  MOVABLE_DEMO,
}

export class Application {
  @observable public align = 0; // -1: left, 0: center, 1: right
  @observable public dialog: number | undefined = undefined;
  public readonly convex = new ConvexDemo();

  @observable public page = Page.SVG_DRAWING;
  public readonly pages: (ViewModel | undefined)[] = [
    undefined,
    new Controls(),
    new EventTracker(),
    new SvgDrawing(),
    new SvgDemo(),
    new SceneDemo(),
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
