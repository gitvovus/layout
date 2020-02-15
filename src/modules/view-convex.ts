import { computed, observable, reaction } from 'mobx';

import * as cvx from '@/lib/convex';
import * as svg from '@/lib/svg';
import source from '!!raw-loader!@/assets/convex.svg';

export class ViewConvex {
  public readonly root = svg.fromSource(source)!;

  @observable public points: cvx.Point[] = [];
  @observable public pointCount = 0;

  private readonly pointsGroup = this.root.find('points')!;
  private readonly marksGroup = this.root.find('marks')!;
  private readonly sortedGroup = this.root.find('sorted')!;
  private readonly convexPath = this.root.find('convex')!;
  private readonly zonePath = this.root.find('zone')!;

  private readonly disposers: Array<() => void> = [];

  public constructor() {
    this.points = sample;
    this.pointCount = this.points.length - 1;
    this.disposers.push(
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

  public compute(points: cvx.Point[], pointCount: number) {
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
    this.sortedGroup.attributes.d = cvx.createPath(sortedPoints, false);
    this.convexPath.attributes.d = cvx.createPath(convex, true);
    const zone = cvx.offset(convex, scale);
    this.zonePath.attributes.d = cvx.createPath(zone, true);

    const box = cvx.bounds(points);
    const margin = 2 * scale;
    this.root.attributes.viewBox =
      `${box.min.x - margin} ${box.min.y - margin} ${box.max.x - box.min.x + 2 * margin} ${box.max.y - box.min.y + 2 * margin}`;
  }
}

const sample: cvx.Point[] = [
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
