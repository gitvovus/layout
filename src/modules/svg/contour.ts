import { autorun, computed, observable } from 'mobx';

import * as std from '@/lib/std';
import * as svg from '@/lib/svg';

const rotation = std.Matrix2x3.rotation;
const scale = std.Matrix2x3.scale;
const translation = std.Matrix2x3.translation;

function toSvg(matrix: std.Matrix2x3) {
  return `matrix(${matrix.elements.join(' ')})`;
}

export class Contour extends svg.Item {
  public static createData(points: std.Point[], closed: boolean, precision: number) {
    if (points.length === 0) {
      return '';
    }
    const chunks: string[] = [];
    chunks.push(`M${points[0].x.toFixed(precision)} ${points[0].y.toFixed(precision)}`);
    for (let i = 1; i < points.length; ++i) {
      const p = points[i];
      chunks.push(`L${p.x.toFixed(precision)} ${p.y.toFixed(precision)}`);
    }
    if (closed) {
      chunks.push('z');
    }
    return chunks.join('');
  }

  @observable public scale = 1;
  @observable public rotation = 0;
  @observable private positionValue = new std.Vector2(0, 0);
  private pointsValue: std.Point[] = [];
  private disposers: Array<() => void> = [];

  public constructor(attributes?: { [key: string]: string | number }, points?: std.Point[]) {
    super('path', attributes);

    if (points) {
      this.points = points;
    }

    this.disposers.push(autorun(() => (this.attributes.transform = toSvg(this.transform))));
  }

  public dispose() {
    this.disposers.forEach(disposer => disposer());
  }

  @computed public get position() {
    return this.positionValue.clone();
  }

  public set position(value: std.Vector2) {
    this.positionValue = value.clone();
  }

  @computed public get transform() {
    return translation(this.positionValue.x, this.positionValue.y)
      .multiply(rotation(this.rotation))
      .multiply(scale(this.scale, this.scale));
  }

  public get points() {
    return this.pointsValue;
  }

  public set points(value: std.Point[]) {
    this.pointsValue = value;
    this.attributes.d = Contour.createData(value, true, 2);
  }
}
