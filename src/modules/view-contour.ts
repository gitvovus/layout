import * as cvx from '@/lib/convex';
import * as svg from '@/lib/svg';
import source from '!!raw-loader!@/assets/convex.svg';

export class ViewContour {
  public readonly root = svg.fromSource(source)!;

  private readonly pointsGroup = this.root.find('points')!;
  private readonly contourPath = this.root.find('contour')!;
  private readonly convexPath = this.root.find('convex')!;
  private readonly zonePath = this.root.find('zone')!;

  public constructor() {
    // this.compute(sample);
    this.computeCloud(cloud);
  }

  public compute(points: cvx.Point[]) {
    const scale = 10;
    points = points.map(point => ({ x: point.x * scale, y: point.y * scale }));

    const contour = cvx.mirror(points);
    const convex = cvx.convexHull(contour);

    const offset = 2 * scale;
    const bounds = cvx.bounds(convex);
    bounds.min.x -= offset;
    bounds.max.x += offset;
    bounds.max.y += offset;
    const zone = cvx.offset(contour, offset, bounds);

    this.contourPath.attributes.d = cvx.createPath(contour, false);
    this.convexPath.attributes.d = cvx.createPath(convex, false);
    this.zonePath.attributes.d = cvx.createPath(zone, true);

    const box = cvx.bounds(zone);
    const margin = 2 * scale;
    this.root.attributes.viewBox = `${box.min.x - margin} ${box.min.y - margin} ${box.max.x - box.min.x + 2 * margin} ${box.max.y - box.min.y + 2 * margin}`;
  }

  public computeCloud(points: cvx.Point[]) {
    const scale = 10;
    points = points.map(point => ({ x: point.x * scale, y: point.y * scale }));

    points.forEach(point => {
      this.pointsGroup.add(new svg.Item('circle', { cx: point.x, cy: point.y, r: 2, fill: 'red' }));
    });

    const box = cvx.bounds(points);
    const margin = 2 * scale;
    this.root.attributes.viewBox = `${box.min.x - margin} ${box.min.y - margin} ${box.max.x - box.min.x + 2 * margin} ${box.max.y - box.min.y + 2 * margin}`;
  }
}

const sample: cvx.Point[] = [
  { x: 0, y: 0 },
  { x: 5, y: 0 },
  { x: 6, y: 1 },
  { x: 6, y: 4 },
  { x: 5, y: 4 },
  { x: 5, y: 8 },
  { x: 4, y: 9 },
  { x: 5, y: 10 },
  { x: 4, y: 11 },
  { x: 5, y: 12 },
  { x: 4, y: 13 },
  { x: 5, y: 14 },
  { x: 4, y: 15 },
  { x: 5, y: 16 },
  { x: 4, y: 20 },
  { x: 0, y: 21 },
];

const star: cvx.Point[] = [
  { x: 0, y: 0 },
  { x: 2, y: 4 },
  { x: 6, y: 4 },
  { x: 3, y: 6 },
  { x: 5, y: 10 },
  { x: 0, y: 7 },
];

const cloud: cvx.Point[] = [
  { x: 5, y: 5 },
  { x: 2, y: 9 },
  { x: 0, y: 4 },
  { x: 7, y: 8 },
  { x: 1, y: 2 },
  { x: 4, y: 0 },
  { x: 6, y: 6 },
  { x: 8, y: 1 },
  { x: 3, y: 3 },
  { x: 9, y: 7 },
];
