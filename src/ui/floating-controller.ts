import { observable } from 'mobx';

interface Handler {
  el: HTMLElement;
  pick: (e: PointerEvent) => void;
  drag: (e: PointerEvent) => void;
  drop: (e: PointerEvent) => void;
}

export class Controller {
  @observable public left = 0;
  @observable public top = 0;
  @observable public width = 800;
  @observable public height = 500;
  @observable public minWidth = 400;
  @observable public minHeight = 250;

  private el!: HTMLElement;
  private cc!: Handler;
  private nw!: Handler;
  private nn!: Handler;
  private ne!: Handler;
  private ww!: Handler;
  private ee!: Handler;
  private sw!: Handler;
  private ss!: Handler;
  private se!: Handler;
  private captured = { x: 0, y: 0 };

  public mount(el: HTMLElement) {
    this.el = el;
    const grid = this.el.firstChild as HTMLElement;
    this.cc = {
      el: grid.children[4] as HTMLElement,
      pick: this.ccPick,
      drag: this.ccDrag,
      drop: this.ccDrop,
    };
    this.nw = {
      el: grid.children[0] as HTMLElement,
      pick: this.nwPick,
      drag: this.nwDrag,
      drop: this.nwDrop,
    },
    this.nn = {
      el: grid.children[1] as HTMLElement,
      pick: this.nnPick,
      drag: this.nnDrag,
      drop: this.nnDrop,
    };
    this.ne = {
      el: grid.children[2] as HTMLElement,
      pick: this.nePick,
      drag: this.neDrag,
      drop: this.neDrop,
    };
    this.ww = {
      el: grid.children[3] as HTMLElement,
      pick: this.wwPick,
      drag: this.wwDrag,
      drop: this.wwDrop,
    };
    this.ee = {
      el: grid.children[5] as HTMLElement,
      pick: this.eePick,
      drag: this.eeDrag,
      drop: this.eeDrop,
    };
    this.sw = {
      el: grid.children[6] as HTMLElement,
      pick: this.swPick,
      drag: this.swDrag,
      drop: this.swDrop,
    };
    this.ss = {
      el: grid.children[7] as HTMLElement,
      pick: this.ssPick,
      drag: this.ssDrag,
      drop: this.ssDrop,
    };
    this.se = {
      el: grid.children[8] as HTMLElement,
      pick: this.sePick,
      drag: this.seDrag,
      drop: this.seDrop,
    };

    this.cc.el.addEventListener('dblclick', this.dblClick);

    [
      this.nw, this.nn, this.ne,
      this.ww, this.cc, this.ee,
      this.sw, this.ss, this.se,
    ]
    .forEach(item => item.el.addEventListener('pointerdown', item.pick));

    this.center();
  }

  public unmount() {
    this.cc.el.removeEventListener('dblclick', this.dblClick);

    [
      this.nw, this.nn, this.ne,
      this.ww, this.cc, this.ee,
      this.sw, this.ss, this.se,
    ]
    .forEach(item => item.el.removeEventListener('pointerdown', item.pick));
  }

  public center() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.left = Math.floor(0.5 * (width - this.width));
    this.top = Math.floor(0.5 * (height - this.height));
  }

  private capture(h: Handler, e: PointerEvent) {
    h.el.addEventListener('pointermove', h.drag);
    h.el.addEventListener('pointerup', h.drop);
    h.el.setPointerCapture(e.pointerId);
  }

  private release(h: Handler, e: PointerEvent) {
    h.el.removeEventListener('pointermove', h.drag);
    h.el.removeEventListener('pointerup', h.drop);
    h.el.releasePointerCapture(e.pointerId);
  }

  private dblClick = (e: Event) => {
    if (e.target === this.cc.el) {
      this.center();
    }
  }

  // -----------------------------------------------------------
  private ccPick = (e: PointerEvent) => {
    if (e.target === this.cc.el && e.buttons & 1) {
      this.captured.x = e.screenX - this.left;
      this.captured.y = e.screenY - this.top;
      this.capture(this.cc, e);
      e.stopPropagation();
      e.preventDefault();
    }
  }

  private ccDrag = (e: PointerEvent) => {
    this.left = e.screenX - this.captured.x;
    this.top = e.screenY - this.captured.y;
  }

  private ccDrop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.release(this.cc, e);
    }
  }

  // -----------------------------------------------------------
  private nwPick = (e: PointerEvent) => {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.left;
      this.captured.y = e.screenY - this.top;
      this.capture(this.nw, e);
    }
  }

  private nwDrag = (e: PointerEvent) => {
    const left = e.screenX - this.captured.x;
    const top = e.screenY - this.captured.y;
    const width = Math.max(this.minWidth, this.left + this.width - left);
    const height = Math.max(this.minHeight, this.top + this.height - top);

    this.left = this.left + this.width - width;
    this.top = this.top + this.height - height;
    this.width = width;
    this.height = height;
  }

  private nwDrop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.release(this.nw, e);
    }
  }

  // -----------------------------------------------------------
  private nnPick = (e: PointerEvent) => {
    if (e.buttons & 1) {
      this.captured.y = e.screenY - this.top;
      this.capture(this.nn, e);
    }
  }

  private nnDrag = (e: PointerEvent) => {
    const top = e.screenY - this.captured.y;
    const height = Math.max(this.minHeight, this.top + this.height - top);

    this.top = this.top + this.height - height;
    this.height = height;
  }

  private nnDrop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.release(this.nn, e);
    }
  }

  // -----------------------------------------------------------
  private nePick = (e: PointerEvent) => {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.width;
      this.captured.y = e.screenY - this.top;
      this.capture(this.ne, e);
    }
  }

  private neDrag = (e: PointerEvent) => {
    const top = e.screenY - this.captured.y;
    const height = Math.max(this.minHeight, this.top + this.height - top);

    this.width = Math.max(this.minWidth, e.screenX - this.captured.x);
    this.top = this.top + this.height - height;
    this.height = height;
  }

  private neDrop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.release(this.ne, e);
    }
  }

  // -----------------------------------------------------------
  private wwPick = (e: PointerEvent) => {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.left;
      this.capture(this.ww, e);
    }
  }

  private wwDrag = (e: PointerEvent) => {
    const left = e.screenX - this.captured.x;
    const width = Math.max(this.minWidth, this.left + this.width - left);

    this.left = this.left + this.width - width;
    this.width = width;
  }

  private wwDrop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.release(this.ww, e);
    }
  }

  // -----------------------------------------------------------
  private eePick = (e: PointerEvent) => {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.width;
      this.capture(this.ee, e);
    }
  }

  private eeDrag = (e: PointerEvent) => {
    this.width = Math.max(this.minWidth, e.screenX - this.captured.x);
  }

  private eeDrop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.release(this.ee, e);
    }
  }

  // -----------------------------------------------------------
  private swPick = (e: PointerEvent) => {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.left;
      this.captured.y = e.screenY - this.height;
      this.capture(this.sw, e);
    }
  }

  private swDrag = (e: PointerEvent) => {
    const left = e.screenX - this.captured.x;
    const width = Math.max(this.minWidth, this.left + this.width - left);

    this.left = this.left + this.width - width;
    this.width = width;
    this.height = Math.max(this.minHeight, e.screenY - this.captured.y);
  }

  private swDrop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.release(this.sw, e);
    }
  }

  // -----------------------------------------------------------
  private ssPick = (e: PointerEvent) => {
    if (e.buttons & 1) {
      this.captured.y = e.screenY - this.height;
      this.capture(this.ss, e);
    }
  }

  private ssDrag = (e: PointerEvent) => {
    this.height = Math.max(this.minHeight, e.screenY - this.captured.y);
  }

  private ssDrop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.release(this.ss, e);
    }
  }

  // -----------------------------------------------------------
  private sePick = (e: PointerEvent) => {
    if (e.buttons & 1) {
      this.captured.x = e.screenX - this.width;
      this.captured.y = e.screenY - this.height;
      this.capture(this.se, e);
    }
  }

  private seDrag = (e: PointerEvent) => {
    this.width = Math.max(this.minWidth, e.screenX - this.captured.x);
    this.height = Math.max(this.minHeight, e.screenY - this.captured.y);
  }

  private seDrop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.release(this.se, e);
    }
  }
}
