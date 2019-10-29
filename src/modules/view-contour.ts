import * as cvx from '@/lib/convex';
import * as svg from '@/lib/svg';
import source from '!!raw-loader!@/assets/convex.svg';

export class ViewContour {
  public readonly root = svg.fromSource(source)!;
  public readonly contourPath = this.root.find('contour')!;
  public readonly convexPath = this.root.find('convex')!;
  public readonly zonePath = this.root.find('zone')!;

  private points: cvx.Point[] = [];
  private contour: cvx.Point[] = [];
  private convex: cvx.Point[] = [];
  private zone: cvx.Point[] = [];

  public constructor(points: cvx.Point[]) {
    const scale = 10;
    this.points = points.map(point => ({ x: point.x * scale, y: point.y * scale }));

    this.contour = cvx.mirror(this.points);
    this.convex = cvx.convexHull(this.contour);

    const offset = 2 * scale;
    const bounds = cvx.bounds(this.convex);
    bounds.min.x -= offset;
    bounds.max.x += offset;
    bounds.max.y += offset;
    this.zone = cvx.offset(this.contour, offset, bounds);

    this.contourPath.attributes.d = cvx.createPath(this.contour, false);
    this.convexPath.attributes.d = cvx.createPath(this.convex, false);
    this.zonePath.attributes.d = cvx.createPath(this.zone, true);

    const box = cvx.bounds(this.zone);
    const margin = 2 * scale;
    this.root.attributes.viewBox = `${box.min.x - margin} ${box.min.y - margin} ${box.max.x - box.min.x + 2 * margin} ${box.max.y - box.min.y + 2 * margin}`;
  }
}

export const sample: cvx.Point[] = [
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
