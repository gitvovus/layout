import * as three from 'three';

import * as utils from '@/lib/utils';

import { Mockup } from '@/modules/scene/mockup';
import { ViewModel } from '@/modules/view-model';

export class SceneDemo implements ViewModel {
  public readonly template = 'scene-demo-view';

  private readonly mockup: Mockup;
  private readonly scene: three.Scene;
  private readonly camera: three.PerspectiveCamera;

  private el!: HTMLElement;
  private width = 0;
  private height = 0;
  private renderer!: three.WebGLRenderer;

  private readonly disposers: (() => void)[] = [];

  public constructor() {
    this.camera = new three.PerspectiveCamera(30, 1, 0.1, 50);
    this.camera.up.set(0, 0, 1);
    this.camera.add(new three.PointLight(0xa0a0a0));

    this.scene = new three.Scene();
    this.scene.add(new three.AmbientLight(0x404040));
    this.scene.add(this.camera);

    this.mockup = new Mockup(this.scene, this.camera);
  }

  public dispose() {
    this.disposers.forEach(disposer => disposer());
    this.disposers.length = 0;
  }

  public mount(el: HTMLElement, canvas: HTMLCanvasElement) {
    this.el = el;
    const bg = new three.Color(window.getComputedStyle(canvas).backgroundColor || 0xa0c0e0);

    this.renderer = new three.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setClearColor(bg);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.mockup.mount(el);

    this.disposers.push(utils.onAnimationFrame(this.render), () => {
      this.mockup.unmount();
      this.renderer.dispose();
      this.el = undefined!;
      this.width = 0;
      this.height = 0;
    });
  }

  public unmount() {
    this.dispose();
  }

  private readonly render = () => {
    this.updateSize();
    this.mockup.update();
    this.renderer.render(this.scene, this.camera);
  };

  private updateSize() {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
}
