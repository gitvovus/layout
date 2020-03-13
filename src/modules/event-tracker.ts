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

  private el?: HTMLElement;
  private readonly disposers: (() => void)[] = [];

  public dispose() {
    this.disposers.forEach(disposer => disposer());
    this.disposers.length = 0;
  }

  public mount(el: HTMLElement) {
    this.el = el;
    this.disposers.push(
      utils.onElementEvent(el, 'pointerdown', this.pick),
      utils.onElementEvent(el, 'pointermove', this.drag),
      utils.onElementEvent(el, 'pointerup', this.drop),
      utils.onElementEvent(el, 'wheel', this.wheel),
    );
  }

  public unmount() {
    this.dispose();
    this.el = undefined;
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
    }
  }

  @action private readonly pick = (e: PointerEvent) => {
    this.update(e);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  @action private readonly drag = (e: PointerEvent) => {
    this.update(e);
  };

  @action private readonly drop = (e: PointerEvent) => {
    this.update(e);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  @action private readonly wheel = (e: WheelEvent) => {
    this.update(e);
    e.preventDefault();
  };
}
