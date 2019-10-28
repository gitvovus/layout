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

export function convexHull(contour: Point[]) {
  const result: Point[] = [];
  let current = 0;
  result.push(contour[current]);
  while (current !== contour.length - 1) {
    let next = current + 1;
    let dir = vector(contour[next], contour[current]);
    let reset = true;
    while (reset) {
      reset = false;
      for (let i = next; i < contour.length - 1; ++i) {
        const check = vector(contour[i], contour[current]);
        if (cross(dir, check) < -1e-4) {
          next = i;
          dir = check;
          reset = true;
          break;
        }
      }
    }
    result.push(contour[next]);
    current = next;
  }

  return result;
}

function distance(point: Point, linePoint: Point, lineNormal: Point) {
  return (point.x - linePoint.x) * lineNormal.x + (point.y - linePoint.y) * lineNormal.y;
}

function findEdge(points: Point[], normal: Point) {
  let max = points[0].x * normal.x + points[0].y * normal.y;
  let index = 0;
  for (let i = 1; i < points.length; ++i) {
    const dot = points[i].x * normal.x + points[i].y * normal.y;
    if (dot > max) {
      max = dot;
      index = i;
    }
  }
  return points[index];
}

export function cut(points: Point[], linePoint: Point, lineNormal: Point) {
  console.log('cut: ', lineNormal.x.toFixed(2), lineNormal.y.toFixed(2));
  const result: Point[] = [];
  let pd = distance(points[0], linePoint, lineNormal);
  let pv = pd <= 0;
  if (pv) {
    result.push(points[0]);
  }
  for (let i = 1; i < points.length; ++i) {
    const point = points[i];
    const cd = distance(point, linePoint, lineNormal);
    const cv = cd <= 0;
    if (cv !== pv) {
      const d = Math.abs(pd) + Math.abs(cd);
      const x = (points[i - 1].x * Math.abs(cd) + point.x * Math.abs(pd)) / d;
      const y = (points[i - 1].y * Math.abs(cd) + point.y * Math.abs(pd)) / d;
      result.push({ x, y });
    }
    if (cv) {
      result.push(point);
    }
    pv = cv;
    pd = cd;
  }
  return result;
}

export function offset(contour: Point[], offset: number, bounds: { min: Point, max: Point}) {
  const convex = convexHull(contour);
  let result: Point[] = [
    { x: bounds.min.x, y: bounds.min.y },
    { x: bounds.max.x, y: bounds.min.y },
    { x: bounds.max.x, y: bounds.max.y },
    { x: bounds.min.x, y: bounds.max.y },
  ];
  for (let i = 1; i < convex.length; ++i) {
    const a = convex[i - 1];
    const b = convex[i];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy);
    if (length < 1e-4) {
      continue;
    }
    const normal = { x: dy / length, y: -dx / length };
    const edge = findEdge(convex, normal);
    const p = { x: edge.x + normal.x * offset, y: edge.y + normal.y * offset };
    result = cut(result, p, normal);
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
