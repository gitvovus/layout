import { observable } from 'mobx';

import * as std from '@/lib/std';

export interface Attributes {
  [key: string]: string | number | undefined;
}

export type ViewBox = { left: number; top: number; width: number; height: number };

export class Item {
  public readonly key = Symbol();
  public readonly tag: string;
  @observable public readonly attributes: Attributes = {};
  @observable public text?: string;
  @observable public readonly items: Item[] = [];
  public parent?: Item;

  private el?: SVGElement;
  private events = new Map<keyof SVGElementEventMap, ((this: SVGElement, e: any) => void)[]>();

  public constructor(tag: string, data?: Attributes | string) {
    this.tag = tag;
    if (data) {
      if (typeof data === 'string') {
        this.text = data;
      } else {
        Object.assign(this.attributes, data);
      }
    }
  }

  public get element() {
    return this.el;
  }

  public get index() {
    return this.parent ? this.parent.items.indexOf(this) : 0;
  }

  public set index(toIndex: number) {
    if (this.parent) {
      this.parent.move(this, toIndex);
    }
  }

  public clear() {
    this.items.forEach(item => (item.parent = undefined));
    this.items.length = 0;
  }

  public add(...items: Item[]) {
    items.forEach(item => {
      item.parent = this;
      this.items.push(item);
    });
  }

  public remove(item: Item) {
    const index = this.items.indexOf(item);
    this.items.splice(index, 1);
    item.parent = undefined;
  }

  public move(item: Item, toIndex: number) {
    const index = this.items.indexOf(item);
    if (index === -1) {
      return;
    }
    if (toIndex < 0) {
      toIndex += this.items.length;
    }
    toIndex = std.clamp(toIndex, 0, this.items.length - 1);
    if (index !== toIndex) {
      this.items.splice(index, 1);
      this.items.splice(toIndex, 0, item);
    }
  }

  public find(id: string): Item | undefined {
    if (this.attributes.id === id) {
      return this;
    }
    for (const item of this.items) {
      const result = item.find(id);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  public findByClass(name: string): Item | undefined {
    if (this.attributes.class !== undefined && (this.attributes.class as string).split(' ').includes(name)) {
      return this;
    }
    for (const item of this.items) {
      const result = item.findByClass(name);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  // TODO: add event listener options
  public on<EventType extends keyof SVGElementEventMap>(
    event: EventType,
    listener: (this: SVGElement, e: SVGElementEventMap[EventType]) => void,
  ) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    const listeners = this.events.get(event)!;
    if (listeners.includes(listener)) {
      return;
    }
    listeners.push(listener);
    if (this.el) {
      this.el.addEventListener(event, listener, { passive: false });
    }
  }

  public off<EventType extends keyof SVGElementEventMap>(
    event?: EventType,
    listener?: (this: SVGElement, e: SVGElementEventMap[EventType]) => void,
  ) {
    if (!event) {
      if (this.el) {
        this.events.forEach((listeners, event) => listeners.forEach(listener => this.el!.removeEventListener(event, listener)));
      }
      this.events.clear();
      return;
    }
    if (!this.events.has(event)) {
      return;
    }
    const listeners = this.events.get(event)!;
    if (!listener) {
      if (this.el) {
        listeners.forEach(listener => this.el!.removeEventListener(event, listener));
      }
      this.events.delete(event);
    } else {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        if (this.el) {
          this.el.removeEventListener(event, listener);
        }
        listeners.splice(index, 1);
      }
    }
  }

  public mount(el: SVGElement) {
    this.unmount();
    this.el = el;
    this.events.forEach((listeners, event) =>
      listeners.forEach(listener => this.el!.addEventListener(event, listener, { passive: false })),
    );
  }

  public unmount() {
    if (this.el) {
      this.events.forEach((listeners, event) => listeners.forEach(listener => this.el!.removeEventListener(event, listener)));
      this.el = undefined;
    }
  }
}

export function fromElement(node: Node) {
  if (node.nodeType === node.TEXT_NODE) {
    const text = (node.nodeValue || '').trim();
    return text.length > 0 ? new Item(node.nodeName, text) : undefined;
  } else if (node instanceof Element) {
    const attributes: Attributes = {};
    for (const attr of node.attributes) {
      attributes[attr.name] = attr.value;
    }
    const item = new Item(node.nodeName, attributes);
    for (const child of node.childNodes) {
      const childItem = fromElement(child);
      if (childItem) {
        item.add(childItem);
      }
    }
    return item;
  }

  return undefined;
}

export function fromSource(text: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(text, 'image/svg+xml');
  return fromElement(document.documentElement);
}

export function toTransform(matrix: std.Matrix2x3) {
  return `matrix(${matrix.elements.join(' ')})`;
}

export function toViewBox({ left, top, width, height }: ViewBox) {
  return `${left} ${top} ${width} ${height}`;
}
