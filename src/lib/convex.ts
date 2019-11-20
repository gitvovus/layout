export interface Point {
  x: number;
  y: number;
}

export function bounds(points: Point[]): { min: Point, max: Point } {
  if (points.length === 0) {
    return { min: { x: 0, y: 0 }, max: { x: 0, y: 0 }};
  }
  const result = { min: {...points[0]}, max: {...points[0]} };
  for (let i = 1; i < points.length; ++i) {
    result.min.x = Math.min(result.min.x, points[i].x);
    result.min.y = Math.min(result.min.y, points[i].y);
    result.max.x = Math.max(result.max.x, points[i].x);
    result.max.y = Math.max(result.max.y, points[i].y);
  }
  return result;
}

export function mirror(points: Point[]) {
  const path = [...points];
  for (let i = points.length - 1; i >= 0; --i) {
    path.push({ x: -points[i].x, y: points[i].y });
  }
  return path;
}

function vector(from: Point, to: Point): Point {
  return { x: to.x - from.x, y: to.y - from.y };
}

function cross(a: Point, b: Point) {
  return a.x * b.y - a.y * b.x;
}

function dot(a: Point, b: Point) {
  return a.x * b.x + a.y * b.y;
}

export function convexHull(contour: Point[]) {
  const result: Point[] = [];
  let current = 0;
  result.push(contour[current]);
  while (true) {
    let next = current < contour.length - 1 ? current + 1 : 0;
    if (next === 0) {
      break;
    }
    let dir = vector(contour[current], contour[next]);
    let t = next < contour.length - 1 ? next + 1 : 0;
    while (true) {
      const test = vector(contour[current], contour[t]);
      if (cross(dir, test) < 0) {
        next = t;
        dir = test;
      }
      if (t === 0) {
        break;
      }
      t = t < contour.length - 1 ? t + 1 : 0;
    }
    if (next === 0) {
      break;
    }
    result.push(contour[next]);
    current = next;
  }

  return result;
}

export function convex2(points: Point[]) {
  points = points.sort((a, b) => a.y - b.y || a.x - b.x);
}

function distance(point: Point, linePoint: Point, lineNormal: Point) {
  return dot(vector(linePoint, point), lineNormal);
}

export function cut(points: Point[], linePoint: Point, lineNormal: Point) {
  const result: Point[] = [];
  let prev = points[points.length - 1];
  let pd = distance(prev, linePoint, lineNormal);
  let pv = pd <= 0;
  if (pv) {
    result.push(prev);
  }
  for (const point of points) {
    const cd = distance(point, linePoint, lineNormal);
    const cv = cd <= 0;
    if (cv !== pv) {
      const d = Math.abs(pd) + Math.abs(cd);
      const x = (prev.x * Math.abs(cd) + point.x * Math.abs(pd)) / d;
      const y = (prev.y * Math.abs(cd) + point.y * Math.abs(pd)) / d;
      result.push({ x, y });
    }
    if (cv) {
      result.push(point);
    }
    pv = cv;
    pd = cd;
    prev = point;
  }
  return result;
}

export function offset(contour: Point[], offset: number, bounds: { min: Point, max: Point}) {
  let result: Point[] = [
    { x: bounds.min.x, y: bounds.min.y },
    { x: bounds.max.x, y: bounds.min.y },
    { x: bounds.max.x, y: bounds.max.y },
    { x: bounds.min.x, y: bounds.max.y },
  ];

  const convex = convexHull(contour);
  for (let i = 0; i < convex.length; ++i) {
    const a = convex[i];
    const prev = i === 0 ? convex[convex.length - 1] : convex[i - 1];
    const next = i < convex.length - 1 ? convex[i + 1] : convex[0];
    const p = vector(prev, a);
    const n = vector(a, next);
    const pLength = Math.hypot(p.x, p.y);
    const nLength = Math.hypot(n.x, n.y);
    if (pLength > 1e-4 && nLength > 1e-4) {
      const v = { x: p.x / pLength + n.x / nLength, y: p.y / pLength + n.y / nLength };
      const vLength = Math.hypot(v.x, v.y);
      const normal = { x: v.y / vLength, y: -v.x / vLength };
      const point = { x: a.x + normal.x * offset, y: a.y + normal.y * offset };
      result = cut(result, point, normal);
    }
    if (nLength > 1e-4) {
      const normal = { x: n.y / nLength, y: -n.x / nLength };
      const point = { x: a.x + normal.x * offset, y: a.y + normal.y * offset };
      result = cut(result, point, normal);
    }
  }

  return result;
}

export function createPath(points: Point[], close: boolean) {
  if (points.length < 1) {
    return '';
  }

  const precision = 2;
  let path = `M${points[0].x.toFixed(precision)} ${points[0].y.toFixed(precision)}`;

  if (points.length < 2) {
    return path;
  }

  for (let i = 1; i < points.length; ++i) {
    path += `L${points[i].x.toFixed(precision)} ${points[i].y.toFixed(precision)}`;
  }

  if (close) {
    path += 'z';
  }

  return path;
}
