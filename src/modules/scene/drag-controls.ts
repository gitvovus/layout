import * as three from 'three';

import * as geometry from '@/lib/geometry';
import * as std from '@/lib/std';

export type VectorConstraint = (v: three.Vector3) => three.Vector3;

export function noConstraints(v: three.Vector3) {
  return (v: three.Vector3) => v;
}

export function dotAxisConstraint(axis: three.Vector3) {
  const a = axis.clone().normalize();
  return (v: three.Vector3) => {
    const x = a.dot(v);
    return a.clone().multiplyScalar(x);
  };
}

export function smoothAxisConstraint(threshold: number, axis: three.Vector3) {
  const a = axis.clone().normalize();
  return (v: three.Vector3) => {
    const x = a.dot(v);
    const f = v.length() * Math.sign(x) * std.smoothStep(0, threshold, Math.abs(x));
    return a.clone().multiplyScalar(f);
  };
}

export function stickAxisConstraint(stick: number, threshold: number, axis: three.Vector3) {
  const a = axis.clone().normalize();
  return (v: three.Vector3) => {
    const x = a.dot(v);
    const f = v.length() * Math.sign(x) * std.smoothStep(stick, threshold, Math.abs(x));
    return a.clone().multiplyScalar(f);
  };
}

export function coneConstraint(axis: three.Vector3, angle: number) {
  const a = axis.clone().normalize();
  const dot = Math.cos(angle);
  return (v: three.Vector3) => {
    const n = v.clone().normalize();
    if (n.dot(a) >= dot) {
      return n;
    }
    const x = a.clone().cross(n);
    if (x.lengthSq() < 1e-4) {
      return a.clone();
    }
    x.normalize();
    const q = new three.Quaternion().setFromAxisAngle(x, angle);
    return a.clone().applyQuaternion(q);
  };
}

export interface DragHandler {
  handle: three.Object3D;
  target?: three.Object3D;
  constraint: VectorConstraint;
  pick(): void;
  drag(v: three.Vector3): void;
}

export class AxisDragHandler implements DragHandler {
  public handle!: three.Object3D;

  private t?: three.Object3D; // target
  private origin = new three.Vector3(); // target local position
  private targetMatrix = new three.Matrix4(); // target local matrix
  private inverseMatrix = new three.Matrix4(); // target world matrix inverse

  public get constraint(): (v: three.Vector3) => three.Vector3 {
    return this.f;
  }

  public set constraint(f: (v: three.Vector3) => three.Vector3) {
    this.f = f;
  }

  public get target() {
    return this.t;
  }

  public set target(value: three.Object3D | undefined) {
    this.t = value;
  }

  public pick() {
    this.origin.copy(this.t!.position);
    this.targetMatrix.copy(this.t!.matrix);
    this.inverseMatrix.getInverse(this.t!.matrixWorld);
  }

  public drag(v: three.Vector3) {
    // offset from picked origin, in world space
    const inverseRotation = new three.Matrix3();
    inverseRotation.setFromMatrix4(this.inverseMatrix);
    v.applyMatrix3(inverseRotation);
    v = this.constraint(v);

    const targetRotation = new three.Matrix3();
    targetRotation.setFromMatrix4(this.targetMatrix);
    v.applyMatrix3(targetRotation);
    v.add(this.origin);
    this.t!.position.copy(v);
  }

  private f: (v: three.Vector3) => three.Vector3 = (v: three.Vector3) => v;
}

export class ConeDragHandler implements DragHandler {
  public root = new three.Object3D();
  public handle!: three.Object3D;

  private t?: three.Object3D;
  private origin = new three.Vector3(); // target local position
  private targetMatrix = new three.Matrix4(); // target local matrix
  private inverseMatrix = new three.Matrix4(); // target world matrix inverse

  private axis: three.Vector3;
  private vector: three.Vector3;
  private angle: number;

  public constructor(axis: three.Vector3, angle: number) {
    this.axis = axis.clone().normalize();
    this.vector = this.axis.clone();
    this.angle = angle;
    const oz = new three.BufferGeometry();
    oz.setAttribute('position', new three.Float32BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 1]), 3));
    this.root.add(new three.LineSegments(oz, new three.LineBasicMaterial({ color: 0x800000 })));

    const r = 16;
    const l = 4;
    const grid = geometry.cylinderGrid(r, l, (ix, iy) => {
      const phi = (2 * Math.PI * ix) / r;
      const theta = 0.5 * Math.PI + this.angle * (iy / l - 1);
      const x = Math.cos(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.cos(theta);
      const z = Math.sin(theta);
      return new three.Vector3(x, y, z);
    });
    this.root.add(new three.LineSegments(grid, new three.LineBasicMaterial({ color: 0, transparent: true, opacity: 0.5 })));
    this.handle = new three.Mesh(geometry.sphere(0.1, 3), new three.MeshPhongMaterial({ color: 0xffff00 }));
    this.handle.position.copy(this.vector);
    this.root.add(this.handle);
    this.constraint = coneConstraint(this.axis, this.angle);
  }

  public get constraint(): (v: three.Vector3) => three.Vector3 {
    return this.f;
  }

  public set constraint(f: (v: three.Vector3) => three.Vector3) {
    this.f = f;
  }

  public get target() {
    return this.t;
  }

  public set target(value: three.Object3D | undefined) {
    this.t = value;
    if (value) {
      this.targetMatrix.copy(value.matrix);
      this.inverseMatrix.getInverse(value.matrixWorld);
    }
  }

  public pick() {
    this.origin.copy(this.vector);
  }

  public drag(v: three.Vector3) {
    const inverseRotation = new three.Matrix3();
    inverseRotation.setFromMatrix4(this.inverseMatrix);
    const scale = new three.Vector3();
    this.root.getWorldScale(scale);
    v.applyMatrix3(inverseRotation).multiplyScalar(1 / scale.x);
    v.add(this.origin);
    this.vector = this.constraint(v);
    this.handle.position.copy(this.vector);

    const q = new three.Quaternion().setFromUnitVectors(this.axis, this.vector);
    const r = new three.Matrix4().makeRotationFromQuaternion(q);
    const m = this.targetMatrix.clone().multiply(r);
    m.decompose(this.t!.position, this.t!.quaternion, this.t!.scale);
  }

  private f: VectorConstraint = (v: three.Vector3) => v;
}

export class DragControl {
  public root!: three.Object3D;
  public items!: DragHandler[];

  private t!: three.Object3D;

  public get target() {
    return this.t;
  }

  public set target(value: three.Object3D) {
    this.t = value;
    for (const item of this.items) {
      item.target = value;
    }
  }
}

export class AxisDragControl extends DragControl {
  public constructor() {
    super();
    this.root = geometry.axes();
    this.items = [new AxisDragHandler(), new AxisDragHandler(), new AxisDragHandler()];
    const v = [new three.Vector3(1, 0, 0), new three.Vector3(0, 1, 0), new three.Vector3(0, 0, 1)];
    for (let i = 0; i < 3; ++i) {
      const item = this.items[i];
      item.handle = this.createHandle(v[i], 0.1, 0xffff00);
      item.constraint = stickAxisConstraint(0.05, 0.25, v[i]);
      this.root.add(item.handle);
    }
  }

  private createHandle(v: three.Vector3, radius: number, color: number) {
    const mesh = new three.Mesh(geometry.sphere(radius, 3), new three.MeshPhongMaterial({ color }));
    mesh.position.copy(v);
    return mesh;
  }
}

export class ConeDragControl extends DragControl {
  public constructor(axis: three.Vector3, angle: number) {
    super();
    this.root = new three.Object3D();

    const item = new ConeDragHandler(axis, angle);
    this.items = [item];
    this.root.add(item.root);
  }
}
