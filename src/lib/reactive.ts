import { IObjectDidChange, action, computed, observable, observe, reaction } from 'mobx';

import { assert } from '@/lib/std';

export type ArrayChange<T> =
  | {
      object: T[];
      type: 'splice';
      index: number;
      removed: T[];
      removedCount: number;
      added: T[];
      addedCount: number;
    }
  | {
      object: T[];
      type: 'update';
      oldValue: T;
      newValue: T;
    };

export type Disposer = () => void;

export interface DisposableInterface {
  dispose(): void;
}

export class Disposable implements DisposableInterface {
  private readonly disposers: Disposer[] = [];

  public dispose() {
    this.disposers.forEach(disposer => disposer());
    this.disposers.length = 0;
  }

  protected addDisposers(...disposers: Disposer[]) {
    this.disposers.push(...disposers);
  }
}

export class List<T> extends Disposable {
  @observable public readonly items: T[];
  @observable private index?: number;

  public constructor(items?: T[], index?: number) {
    super();
    this.items = items || [];
    this.selectedIndex = index;
    this.addDisposers(
      reaction(
        () => this.items.length,
        length => {
          if (this.index !== undefined && this.index >= length) {
            this.index = length === 0 ? undefined : length - 1;
          }
        },
      ),
    );
  }

  @computed public get selectedIndex() {
    return this.index;
  }

  public set selectedIndex(value: number | undefined) {
    if (value === undefined) {
      this.index = undefined;
    } else if (value >= 0 && value < this.items.length) {
      this.index = value;
    }
  }

  @computed public get selectedItem() {
    return this.index === undefined ? undefined : this.items[this.index];
  }

  public set selectedItem(value: T | undefined) {
    if (value === undefined) {
      this.index = undefined;
    } else {
      const index = this.items.indexOf(value);
      if (index !== -1) {
        this.index = index;
      }
    }
  }
}

export class Selection<T> extends Disposable {
  @observable public readonly items: T[];
  @observable private item?: T;

  public constructor(items: T[]) {
    super();
    this.items = items;
    this.addDisposers(observe(this.items, this.onItemsChanged));
  }

  @computed public get selectedItem() {
    return this.item;
  }

  public set selectedItem(item: T | undefined) {
    this.item = item;
  }

  @computed public get isSelected() {
    return (item: T) => item === this.item;
  }

  @action public select(item: T) {
    this.item = item;
  }

  @action public unselect(item: T) {
    if (this.item === item) {
      this.item = undefined;
    }
  }

  @action public invertSelection(item: T) {
    this.item = item !== this.item ? item : undefined;
  }

  private readonly onItemsChanged = (c: IObjectDidChange) => {
    const change = (c as any) as ArrayChange<T>;
    switch (change.type) {
      case 'update':
        this.unselect(change.oldValue);
        break;
      case 'splice':
        change.removed.forEach(item => this.unselect(item));
        break;
      default:
        assert(false);
    }
  };
}

export class MultiSelection<T> extends Disposable {
  @observable public readonly items: T[];
  @observable private readonly selected: T[] = [];

  public constructor(items: T[]) {
    super();
    this.items = items;
    this.addDisposers(observe(this.items, this.onItemsChanged));
  }

  @computed public get selectedItems() {
    return this.selected;
  }

  public set selectedItems(items: T[]) {
    this.selected.splice(0, this.selected.length, ...items);
  }

  @action public select(item: T) {
    if (!this.selected.includes(item)) {
      this.selected.push(item);
    }
  }

  @action public unselect(item: T) {
    const index = this.selected.indexOf(item);
    if (index !== -1) {
      this.selected.splice(index, 1);
    }
  }

  @computed public get isSelected() {
    return (item: T) => this.selected.includes(item);
  }

  @action public invertSelection(item: T) {
    const index = this.selected.indexOf(item);
    if (index === -1) {
      this.selected.push(item);
    } else {
      this.selected.splice(index, 1);
    }
  }

  @action public clear() {
    this.selected.length = 0;
  }

  private onItemsChanged = (c: IObjectDidChange) => {
    const change = (c as any) as ArrayChange<T>;
    switch (change.type) {
      case 'update':
        this.unselect(change.oldValue);
        break;
      case 'splice':
        change.removed.forEach(item => this.unselect(item));
        break;
      default:
        assert(false);
    }
  };
}
