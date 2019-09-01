import { computed, observable } from 'mobx';

import * as std from '@/lib/std';

export class Camera {
  @observable public position = new std.Vector2(0, 0);
  @observable public rotation = 0;
  @observable public scale = new std.Vector2(1, 1);

  public constructor() {
    const w = window as any;
    w.p = (x: number, y: number) => this.position = new std.Vector2(x, y);
    w.r = (a: number) => this.rotation = a;
    w.s = (x: number, y: number) => this.scale = new std.Vector2(x, y);
  }

  @computed public get transform() {
    return std.Matrix2x3.translation(this.position).multiply(std.Matrix2x3.rotation(this.rotation)).multiply(std.Matrix2x3.scale(this.scale));
  }
}
