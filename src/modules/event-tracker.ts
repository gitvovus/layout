import { action, observable } from 'mobx';

import * as utils from '@/lib/utils';

import { ViewModel } from '@/modules/view-model';

export class EventTracker implements ViewModel {
  public readonly template = 'event-tracker-view';

  @observable public lastEvent = '';
  @observable public leftButton = false;
  @observable public rightButton = false;
  @observable public middleButton = false;
  @observable public clientX = 0;
  @observable public clientY = 0;
  @observable public deltaX = 0;
  @observable public deltaY = 0;
  @observable public deltaZ = 0;
  @observable public deltaMode = 0;

  private el?: HTMLElement;
  private parent?: HTMLElement;
  private child?: HTMLElement;
  private readonly disposers: (() => void)[] = [];

  public dispose() {
    this.disposers.forEach(disposer => disposer());
    this.disposers.length = 0;
  }

  public mount(el: HTMLElement) {
    this.el = el;
    this.parent = el.getElementsByClassName('event-tracker-parent')![0] as HTMLElement;
    this.child = el.getElementsByClassName('event-tracker-child')![0] as HTMLElement;
    this.disposers.push(
      utils.onElementEvent(el, 'pointerdown', this.pick),
      utils.onElementEvent(el, 'pointermove', this.drag),
      utils.onElementEvent(el, 'pointerup', this.drop),
      utils.onElementEvent(el, 'wheel', this.wheel),
      utils.onElementEvent(this.parent, 'pointerdown', e => console.log('parent', e.type)),
      utils.onElementEvent(this.parent, 'mousedown', e => console.log('parent', e.type)),
      utils.onElementEvent(this.child, 'pointerdown', e => console.log('child', e.type)),
      utils.onElementEvent(this.child, 'mousedown', e => console.log('child', e.type)),
    );
  }

  public unmount() {
    this.dispose();
    this.el = undefined;
    this.parent = undefined;
    this.child = undefined;
  }

  @action private update(e: PointerEvent | WheelEvent) {
    this.lastEvent = e.type;

    this.leftButton = (e.buttons & 1) !== 0;
    this.rightButton = (e.buttons & 2) !== 0;
    this.middleButton = (e.buttons & 4) !== 0;

    this.clientX = e.clientX;
    this.clientY = e.clientY;

    if (e instanceof WheelEvent) {
      this.deltaX = e.deltaX;
      this.deltaY = e.deltaY;
      this.deltaZ = e.deltaZ;
      this.deltaMode = e.deltaMode;
    }
  }

  @action private readonly pick = (e: PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.update(e);
  };

  @action private readonly drag = (e: PointerEvent) => {
    this.update(e);
  };

  @action private readonly drop = (e: PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    this.update(e);
  };

  @action private readonly wheel = (e: WheelEvent) => {
    e.preventDefault();
    this.update(e);
  };
}
