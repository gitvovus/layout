import { observable } from 'mobx';
import * as three from 'three';

import * as geometry from '@/lib/geometry';
import { Disposable } from '@/lib/reactive';

export interface Attributes {
  template?: string;
  label?: string;
  icon?: string;
}

export function merge(attributes: Attributes, overwrite?: Attributes) {
  return Object.assign(attributes, overwrite);
}

export class Item extends Disposable {
  @observable public template!: string;
  @observable public label!: string;
  @observable public icon!: string;
  @observable.shallow public readonly items: Item[] = [];

  public constructor(attributes?: Attributes) {
    super();
    Object.assign(this, merge({ template: 'item-template', label: 'Item', icon: 'icon-home' }, attributes));
    this.addDisposers(() => {
      this.items.forEach(item => item.dispose());
      this.items.length = 0;
    });
  }
}

export class Object3D extends Item {
  public root!: three.Object3D;

  public constructor(attributes?: Attributes) {
    super(merge({ template: 'object-3d', label: 'Object3D', icon: 'icon-view3d' }, attributes));
    this.addDisposers(() => {
      if (this.root.parent) {
        this.root.parent.remove(this.root);
      }
      geometry.dispose(this.root);
    });
  }
}
