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

export function convexSort(points: Point[]) {
  if (points.length < 3) {
    return [...points];
  }
  let start = 0;
  points.forEach((point, index) => {
    const startPoint = points[start];
    if (point.y < startPoint.y || (point.y === startPoint.y && point.x < startPoint.x)) {
      start = index;
    }
  });
  const head = points[start];
  const tail = [...points];
  tail.splice(start, 1);
  tail.sort((a, b) => cross(vector(head, b), vector(head, a)));
  return [points[start], ...tail];
}

export function convex(points: Point[]) {
  if (points.length < 3) {
    return [...points];
  }
  points = convexSort(points);
  const result = [points[0]];
  let last = 0;
  let next = last + 1 < points.length ? last + 1 : 0;
  while (next !== 0) {
    for (let i = last - 1; i >= 0; --i) {
      const dir = vector(result[last], points[next]);
      const test = vector(result[i], points[next]);
      if (cross(dir, test) > 0) {
        last = i;
        result.length = last + 1;
      } else {
        break;
      }
    }
    result.push(points[next]);
    ++last;
    next = next + 1 < points.length ? next + 1 : 0;
  }
  return result;
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

export function offset(contour: Point[], offset: number) {
  if (contour.length === 0) {
    return [];
  }
  const b = bounds(contour);
  b.min.x -= offset;
  b.max.x += offset;
  b.min.y -= offset;
  b.max.y += offset;
  let result: Point[] = [
    { x: b.min.x, y: b.min.y },
    { x: b.max.x, y: b.min.y },
    { x: b.max.x, y: b.max.y },
    { x: b.min.x, y: b.max.y },
  ];
  if (contour.length === 1) {
    return result;
  }

  const cvx = convex(contour);
  for (let i = 0; i < cvx.length; ++i) {
    const a = cvx[i];
    const prev = i === 0 ? cvx[cvx.length - 1] : cvx[i - 1];
    const next = i < cvx.length - 1 ? cvx[i + 1] : cvx[0];
    const p = vector(prev, a);
    const n = vector(a, next);
    const pLength = Math.hypot(p.x, p.y);
    const nLength = Math.hypot(n.x, n.y);
    if (pLength > 1e-4 && nLength > 1e-4) {
      let v = { x: p.x / pLength + n.x / nLength, y: p.y / pLength + n.y / nLength };
      let vLength = Math.hypot(v.x, v.y);
      if (vLength <= 1e-4) {
        v = { x: -p.y / pLength, y: p.x / pLength };
        vLength = Math.hypot(v.x, v.y);
      }
      if (vLength > 1e-4) {
        const normal = { x: v.y / vLength, y: -v.x / vLength };
        const point = { x: a.x + normal.x * offset, y: a.y + normal.y * offset };
        result = cut(result, point, normal);
      }
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
