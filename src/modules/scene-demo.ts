import * as three from 'three';

import { Disposable } from '@/lib/reactive';
import * as utils from '@/lib/utils';

import { Mockup } from '@/modules/scene/mockup';
import { ViewModel } from '@/modules/view-model';

export class SceneDemo extends Disposable implements ViewModel {
  public readonly template = 'scene-demo-view';

  private readonly mockup: Mockup;
  private readonly scene: three.Scene;
  private readonly camera: three.PerspectiveCamera;

  private element!: HTMLElement;
  private width = 0;
  private height = 0;
  private renderer!: three.WebGLRenderer;

  public constructor() {
    super();
    this.camera = new three.PerspectiveCamera(30, 1, 0.1, 50);
    this.camera.up.set(0, 0, 1);
    this.camera.add(new three.PointLight(0xa0a0a0));

    this.scene = new three.Scene();
    this.scene.add(new three.AmbientLight(0x404040));
    this.scene.add(this.camera);

    this.mockup = new Mockup(this.scene, this.camera);
  }

  public mount(element: HTMLElement, canvas: HTMLCanvasElement) {
    this.element = element;
    const bg = new three.Color(window.getComputedStyle(canvas).backgroundColor || 0xa0c0e0);

    this.renderer = new three.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setClearColor(bg);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.mockup.mount(element);

    this.addDisposers(utils.onAnimationFrame(this.render), () => {
      this.mockup.unmount();
      this.element = undefined!;
      this.width = 0;
      this.height = 0;
      const renderer = this.renderer;
      this.renderer = undefined!;
      // delayed dispose to allow smooth fadeout for the view
      setTimeout(() => renderer.dispose(), 1000);
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
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;

    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
}
