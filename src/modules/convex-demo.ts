import { computed, observable, reaction } from 'mobx';

import { Point } from '@/lib/std';
import * as cvx from '@/lib/convex';
import * as svg from '@/lib/svg';
import { Disposable } from '@/lib/reactive';

import { ViewModel } from '@/modules/view-model';

import source from '!!raw-loader!@/assets/convex.svg';

const sample: Point[] = [
  { x: 4, y: 0 },
  { x: 8, y: 1 },
  { x: 1, y: 2 },
  { x: 3, y: 3 },
  { x: 0, y: 4 },
  { x: 5, y: 5 },
  { x: 6, y: 6 },
  { x: 9, y: 7 },
  { x: 7, y: 8 },
  { x: 2, y: 9 },
];

export class ConvexDemo extends Disposable implements ViewModel {
  public readonly template = 'convex-demo-view';
  public readonly root = svg.fromSource(source)!;

  @observable public points: Point[] = [];
  @observable public pointCount = 0;

  private readonly pointsGroup = this.root.findByClass('points')!;
  private readonly marksGroup = this.root.findByClass('marks')!;
  private readonly sortedGroup = this.root.findByClass('sorted')!;
  private readonly convexPath = this.root.findByClass('convex')!;
  private readonly zonePath = this.root.findByClass('zone')!;

  public constructor() {
    super();
    this.points = sample;
    this.pointCount = this.points.length - 1;
    this.addDisposers(
      reaction(
        () => this.pointCount,
        () => this.compute(this.points, this.pointCount),
        { fireImmediately: true },
      ),
    );
  }

  @computed public get maxLength() {
    return this.points.length;
  }

  public compute(points: Point[], pointCount: number) {
    const scale = 10;
    points = points.map(point => ({ x: point.x * scale, y: point.y * scale }));

    const sortedPoints = cvx.convexSort(points.slice(0, pointCount));
    const convex = cvx.convex(sortedPoints);

    this.pointsGroup.clear();
    points.forEach(point => {
      this.pointsGroup.add(new svg.Item('circle', { cx: point.x, cy: point.y, r: 2 }));
    });
    this.marksGroup.clear();
    sortedPoints.forEach(point => {
      this.marksGroup.add(new svg.Item('circle', { cx: point.x, cy: point.y, r: 2 }));
    });
    this.sortedGroup.attributes.d = cvx.createData(sortedPoints, false, 2);
    this.convexPath.attributes.d = cvx.createData(convex, true, 2);
    const zone = cvx.offset(convex, scale);
    this.zonePath.attributes.d = cvx.createData(zone, true, 2);

    const box = cvx.bounds(points);
    const margin = 2 * scale;
    box.min.x -= margin;
    box.min.y -= margin;
    box.max.x += margin;
    box.max.y += margin;
    this.root.attributes.viewBox = `${box.min.x} ${box.min.y} ${box.max.x - box.min.x} ${box.max.y - box.min.y}`;
  }
}
