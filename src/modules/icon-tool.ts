import { computed } from 'mobx';

import * as std from '@/lib/std';
import * as svg from '@/lib/svg';
import { Disposable, List } from '@/lib/reactive';
import { onElementEvent } from '@/lib/utils';

import { Camera } from '@/modules/svg/camera';
import { Controller } from '@/modules/svg/controller';
import { ViewModel } from '@/modules/view-model';

import source from '!!raw-loader!@/assets/icon-tool.svg';

export class IconTool extends Disposable implements ViewModel {
  public readonly template = 'icon-tool';

  private readonly root = svg.fromSource(source)!;
  private readonly scene = this.root.findByClass('scene')!;
  private readonly camera = new Camera({ position: new std.Vector2(32, 32) });
  private readonly controller = new Controller(this.root, this.camera);

  private readonly icons = new svg.Item('g');
  private readonly items = new List<svg.Item>(this.icons.items);

  private idSeed = 0;

  public constructor() {
    super();
    this.controller.setReferenceSize(66, 66);
    this.scene.add(this.icons);
    this.icons.add(new svg.Item('path', { id: this.generateId(), class: 'svg-cursor', d: 'M 1 1 L 51 21 L 21 51 z' }));
    this.items.selectedIndex = 0;
  }

  public mount(element: HTMLElement) {
    this.controller.mount(element.getElementsByClassName('container')[0] as HTMLElement);
    this.addDisposers(
      onElementEvent(element, 'keydown', (e: KeyboardEvent) => {
        if (e.code === 'KeyP') {
          console.log(this.selectedItem!.element!.outerHTML);
        }
      }),
    );
  }

  public unmount() {
    this.controller.unmount();
    this.dispose();
  }

  @computed public get selectedIndex() {
    return this.items.selectedIndex;
  }

  public set selectedIndex(index: number | undefined) {
    this.items.selectedIndex = index;
  }

  @computed public get selectedItem() {
    return this.items.selectedItem;
  }

  public set selectedItem(item: svg.Item | undefined) {
    this.items.selectedItem = item;
  }

  private generateId() {
    return `icon-tool-${this.idSeed++}`;
  }
}
