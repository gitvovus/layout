import { computed, observable } from 'mobx';

import * as std from '@/lib/std';

const rotation = std.Matrix2x3.rotation;
const scale = std.Matrix2x3.scale;
const translation = std.Matrix2x3.translation;

export class Camera {
  @observable public scale = 1;
  @observable public rotation = 0;
  @observable private positionValue = new std.Vector2(0, 0);

  @computed public get position() {
    return this.positionValue.clone();
  }

  public set position(value: std.Vector2) {
    this.positionValue = value.clone();
  }

  @computed public get transform() {
    return translation(this.positionValue.x, this.positionValue.y).multiply(rotation(this.rotation)).multiply(scale(this.scale, this.scale));
  }

  @computed public get inverseTransform() {
    return scale(1 / this.scale, 1 / this.scale).multiply(rotation(-this.rotation)).multiply(translation(-this.positionValue.x, -this.positionValue.y));
  }
}
