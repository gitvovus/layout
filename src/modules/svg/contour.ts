import { observable, reaction } from 'mobx';

import { Point } from '@/lib/std';
import * as svg from '@/lib/svg';

export class Contour extends svg.Item {
  public static createData(points: Point[], closed: boolean, precision: number) {
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

  @observable public offset: Point = observable({ x: 0, y: 0 });
  private pointsValue: Point[] = [];
  private disposers: Array<() => void> = [];

  public constructor(attributes?: { [key: string]: string | number }, points?: Point[]) {
    super('path', attributes);

    if (points) {
      this.points = points;
    }

    this.disposers.push(
      reaction(
        () => [this.offset.x, this.offset.y],
        () => this.attributes.transform = `translate(${this.offset.x} ${this.offset.y})`,
        { fireImmediately: true },
      ),
    );
  }

  public dispose() {
    this.disposers.forEach(disposer => disposer());
  }

  public get points() {
    return this.pointsValue;
  }

  public set points(value: Point[]) {
    this.pointsValue = value;
    this.attributes.d = Contour.createData(value, true, 2);
  }
}
