import { computed, observable } from 'mobx';

import * as std from '@/lib/std';

const rotation = std.Matrix2x3.rotation;
const scale = std.Matrix2x3.scale;
const translation = std.Matrix2x3.translation;

export class Camera {
  @observable public position = new std.Vector2(0, 0);
  @observable public rotation = 0;
  @observable public scale = 1;

  @computed public get transform() {
    return translation(this.position.x, this.position.y).multiply(rotation(this.rotation)).multiply(scale(this.scale, this.scale));
  }
}
