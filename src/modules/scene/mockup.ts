import { computed, observable, reaction } from 'mobx';
import * as three from 'three';

import * as geometry from '@/lib/geometry';
import * as reactive from '@/lib/reactive';
import * as utils from '@/lib/utils';

import { Controller } from '@/modules/scene/controller';
import * as drag from '@/modules/scene/drag-controls';
import * as models from '@/modules/scene/models';
import { SelectionGroup } from '@/modules/scene/selection-group';

export class Model extends models.Item {
  private list: reactive.List<models.Item>;

  public constructor() {
    super({ template: 'mockup', label: 'Mockup' });
    this.list = new reactive.List(this.items);
    this.addDisposers(() => this.list.dispose());
  }

  @computed public get selectedIndex() {
    return this.list.selectedIndex;
  }

  public set selectedIndex(value: number | undefined) {
    this.list.selectedIndex = value;
  }

  @computed public get selectedItem() {
    return this.list.selectedItem;
  }

  public set selectedItem(value: models.Item | undefined) {
    this.list.selectedItem = value;
  }
}

export class Mockup extends reactive.Disposable {
  @observable public model!: Model;

  private scene!: three.Scene;
  private camera!: three.Camera;
  private element!: HTMLElement;
  private readonly controller: Controller;

  private root!: three.Object3D;
  private child!: three.Object3D;

  private moveControl!: drag.DragControl;
  private coneControl!: drag.DragControl;
  private activeControl?: drag.DragControl;

  private objects = new SelectionGroup();
  private handles = new SelectionGroup();

  private raycaster = new three.Raycaster();
  private dragHandler?: drag.DragHandler;
  private dragOrigin = new three.Vector3();
  private plane = new three.Plane();

  private coneTarget!: three.Object3D;

  public constructor(scene: three.Scene, camera: three.Camera) {
    super();
    this.scene = scene;
    this.camera = camera;
    this.controller = new Controller({
      phi: -Math.PI / 2,
      theta: Math.PI / 6,
      radius: 5,
      minRadius: 1,
      lookAt: new three.Vector3(0, 0, 0.25),
      zoom: 1.5,
    });

    this.setupScene();
    this.setupObjects();

    this.addDisposers(
      reaction(
        () => this.model.selectedItem,
        item => this.select(this.objects, item && (item as models.Object3D).root),
        { fireImmediately: true },
      ),
      () => {
        this.controller.dispose();
        this.scene.remove(this.root);
        geometry.dispose(this.root);
      },
    );
  }

  public update() {
    this.controller.update(this.camera);
  }

  public mount(element: HTMLElement) {
    this.element = element;
    this.element.addEventListener('pointerdown', this.pick);
    this.element.addEventListener('pointermove', this.drag);
    this.element.addEventListener('pointerup', this.drop);
    this.controller.mount(element);
  }

  public unmount() {
    this.controller.unmount();
    this.element.removeEventListener('pointerdown', this.pick);
    this.element.removeEventListener('pointermove', this.drag);
    this.element.removeEventListener('pointerup', this.drop);
    this.element = undefined!;
  }

  private setupScene() {
    this.root = new three.Group();
    this.scene.add(this.root);

    const grid = new three.LineSegments(
      geometry.grid(10, 10, (x, y) => new three.Vector3(0.2 * x - 1, 0.2 * y - 1, 0)),
      new three.LineBasicMaterial({ color: 0, transparent: true, opacity: 0.25 }),
    );
    this.root.add(grid);

    const ox = new three.Mesh(geometry.sphere(0.01, 3), new three.MeshPhongMaterial({ color: 0xff0000 }));
    ox.position.set(1, 0, 0);
    this.root.add(ox);

    this.child = new three.LineSegments(
      geometry.grid(10, 10, (x, y) => new three.Vector3(0.2 * x - 1, 0.2 * y - 1, 0)),
      new three.LineBasicMaterial({ color: 0x0, transparent: true, opacity: 0.25 }),
    );
    this.child.position.set(0.5, 0.5, 0.5);
    this.child.scale.setScalar(0.5);
    this.child.rotateZ(1);
    this.child.rotateY(-0.5);
    this.child.rotateX(0.2);
    this.root.add(this.child);

    const oxChild = new three.Mesh(geometry.sphere(0.02, 3), new three.MeshPhongMaterial({ color: 0xff0000 }));
    oxChild.position.set(1, 0, 0);
    this.child.add(oxChild);
  }

  private setupObjects() {
    this.model = new Model();

    const a = new models.Object3D({ label: 'Object A' });
    const b = new models.Object3D({ label: 'Object B' });
    const b1 = new models.Object3D({ label: 'Object B1' });
    const b2 = new models.Object3D({ label: 'Object B2' });
    b.items.push(b1, b2);

    a.root = new three.Mesh(
      new three.BoxBufferGeometry(0.25, 0.25, 0.25),
      new three.MeshPhongMaterial({ color: 0x4080c0, transparent: true, opacity: 0.75 }),
    );
    a.root.renderOrder = 1;
    a.root.position.set(-0.6, 0.2, 0.125);

    b.root = new three.Mesh(
      new three.BoxBufferGeometry(0.25, 0.25, 0.25),
      new three.MeshPhongMaterial({ color: 0x4080c0, transparent: true, opacity: 0.75 }),
    );
    b.root.renderOrder = 1;
    b.root.position.set(0.6, -0.4, 0.25);
    b.root.rotateZ(2);
    b.root.rotateY(0.5);
    b.root.rotateX(-0.2);

    b1.root = new three.Mesh(
      new three.BoxBufferGeometry(0.1, 0.1, 0.1),
      new three.MeshPhongMaterial({ color: 0x00c0d0, transparent: true, opacity: 0.75 }),
    );
    b1.root.renderOrder = 1;
    b1.root.position.set(-0.4, 0.1, -0.1);

    b2.root = new three.Mesh(
      new three.BoxBufferGeometry(0.1, 0.1, 0.1),
      new three.MeshPhongMaterial({ color: 0x00c0d0, transparent: true, opacity: 0.75 }),
    );
    b2.root.renderOrder = 1;
    b2.root.position.set(-0.1, 0.4, -0.1);

    b.root.add(b1.root);
    b.root.add(b2.root);

    const c = new models.Object3D({ label: 'Object C' });
    const d = new models.Object3D({ label: 'Object D' });

    c.root = new three.Mesh(
      new three.BoxBufferGeometry(0.25, 0.25, 0.25),
      new three.MeshPhongMaterial({ color: 0x4080c0, transparent: true, opacity: 0.75 }),
    );
    c.root.renderOrder = 1;
    c.root.position.set(-0.6, 0.2, 0.125);

    d.root = new three.Mesh(
      new three.BoxBufferGeometry(0.25, 0.25, 0.25),
      new three.MeshPhongMaterial({ color: 0x4080c0, transparent: true, opacity: 0.75 }),
    );
    d.root.renderOrder = 1;
    d.root.position.set(0.6, -0.4, 0.25);
    d.root.rotateZ(2);
    d.root.rotateY(0.5);
    d.root.rotateX(-0.2);

    const r = new models.Object3D({ label: 'Object R' });
    r.root = new three.Mesh(
      new three.BoxBufferGeometry(0.2, 0.2, 0.1),
      new three.MeshPhongMaterial({ color: 0x800040, transparent: true, opacity: 0.75 }),
    );
    r.root.renderOrder = 1;
    r.root.position.set(-0.3, -0.3, -0.05);
    this.coneTarget = r.root;

    this.model.items.push(a, b, b1, b2, r, c, d);
    this.model.items.forEach(item => this.objects.items.push((item as models.Object3D).root));

    this.root.add(a.root);
    this.root.add(b.root);
    this.root.add(r.root);
    this.child.add(c.root);
    this.child.add(d.root);

    this.moveControl = new drag.AxisDragControl();
    this.moveControl.root.scale.setScalar(0.2);
    this.moveControl.items.forEach(item => this.handles.items.push(item.handle));

    this.coneControl = new drag.ConeDragControl(new three.Vector3(0, 0, 1), 0.5);
    this.coneControl.root.scale.setScalar(0.25);
    this.coneControl.items.forEach(item => this.handles.items.push(item.handle));
  }

  private hover(group: SelectionGroup, object?: three.Object3D) {
    group.hovered = object;
  }

  private select(group: SelectionGroup, object?: three.Object3D) {
    if (object === group.selected) {
      return;
    }
    if (group.selected) {
      group.selected.remove(this.activeControl!.root);
    }

    group.selected = object;
    if (!object) {
      return;
    }

    this.activeControl = object === this.coneTarget ? this.coneControl : this.moveControl;
    object.add(this.activeControl.root);
    this.activeControl.target = object;
  }

  private rayCast(items: three.Object3D[], xy: { x: number; y: number }): three.Intersection | undefined {
    this.raycaster.setFromCamera(xy, this.camera);
    const intersections = this.raycaster.intersectObjects(items);
    return intersections.length > 0 ? intersections[0] : undefined;
  }

  private xyFromEvent(e: PointerEvent) {
    const { x, y } = utils.elementOffset(this.element, e);
    return {
      x: (x / this.element.clientWidth) * 2 - 1,
      y: (y / this.element.clientHeight) * -2 + 1,
    };
  }

  private pick = (e: PointerEvent) => {
    if (this.dragHandler) {
      return;
    }

    if (e.buttons & 2) {
      this.hover(this.handles);
      this.model.selectedItem = undefined;
      return;
    }

    if (!(e.buttons & 1)) {
      return;
    }

    const xy = this.xyFromEvent(e);
    let rayCast: three.Intersection | undefined;
    if (this.objects.selected) {
      rayCast = this.rayCast(this.handles.items, xy);
      if (rayCast) {
        for (const dragger of this.activeControl!.items) {
          if (rayCast.object === dragger.handle) {
            dragger.pick();

            this.dragHandler = dragger;
            this.dragOrigin = rayCast.point;
            const dir = new three.Vector3();
            this.camera.getWorldDirection(dir);
            this.plane.setFromNormalAndCoplanarPoint(dir, rayCast.point);

            this.element.setPointerCapture(e.pointerId);
            e.stopImmediatePropagation();
            return;
          }
        }
      }
    }

    rayCast = this.rayCast(this.objects.items, xy);
    if (!rayCast) {
      return;
    }

    for (const item of this.model.items) {
      if (rayCast.object === (item as models.Object3D).root) {
        this.model.selectedItem = item;
        break;
      }
    }
  };

  private drag = (e: PointerEvent) => {
    const xy = this.xyFromEvent(e);

    if (this.dragHandler) {
      this.raycaster.setFromCamera(xy, this.camera);
      const v = new three.Vector3();
      this.raycaster.ray.intersectPlane(this.plane, v);
      v.sub(this.dragOrigin);
      this.dragHandler.drag(v);
    } else {
      if (e.buttons & 3) {
        return;
      }

      let rayCast: three.Intersection | undefined;
      if (this.objects.selected) {
        rayCast = this.rayCast(this.handles.items, xy);
        if (rayCast) {
          for (const dragger of this.activeControl!.items) {
            if (rayCast.object === dragger.handle) {
              this.hover(this.handles, rayCast.object);
              this.hover(this.objects);
              return;
            }
          }
        }
      }

      rayCast = this.rayCast(this.objects.items, xy);
      if (rayCast) {
        this.hover(this.handles);
        this.hover(this.objects, rayCast.object);
      } else {
        this.hover(this.handles);
        this.hover(this.objects);
      }
    }
  };

  private drop = (e: PointerEvent) => {
    if (this.dragHandler && (e.buttons & 1) === 0) {
      this.dragHandler = undefined;
      this.element.releasePointerCapture(e.pointerId);
    }
  };
}
