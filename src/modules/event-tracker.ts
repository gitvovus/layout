import { action, observable } from 'mobx';

import { Disposable } from '@/lib/reactive';
import * as utils from '@/lib/utils';

import { ViewModel } from '@/modules/view-model';

export class EventTracker extends Disposable implements ViewModel {
  public readonly template = 'event-tracker';
  public readonly key = Symbol();

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

  private parent?: HTMLElement;
  private child?: HTMLElement;

  public mount(element: HTMLElement) {
    this.parent = element.getElementsByClassName('event-tracker-parent')![0] as HTMLElement;
    this.child = element.getElementsByClassName('event-tracker-child')![0] as HTMLElement;
    this.addDisposers(
      utils.onElementEvent(element, 'pointerdown', this.pick),
      utils.onElementEvent(element, 'pointermove', this.drag),
      utils.onElementEvent(element, 'pointerup', this.drop),
      utils.onElementEvent(element, 'wheel', this.wheel, { passive: false }),
      utils.onElementEvent(this.parent, 'pointerdown', e => console.log('parent', e.type)),
      utils.onElementEvent(this.parent, 'mousedown', e => console.log('parent', e.type)),
      utils.onElementEvent(this.child, 'pointerdown', e => console.log('child', e.type)),
      utils.onElementEvent(this.child, 'mousedown', e => console.log('child', e.type)),
    );
  }

  public unmount() {
    this.dispose();
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
