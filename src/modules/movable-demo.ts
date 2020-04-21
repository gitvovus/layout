import { action, observable } from 'mobx';

import { MovableView } from '@/modules/movable-view';
import { SceneDemo } from '@/modules/scene-demo';
import { SvgDemo } from '@/modules/svg-demo';
import { ViewModel } from '@/modules/view-model';

export class MovableDemo implements ViewModel {
  public readonly template = 'movable-demo';

  @observable public readonly movable: MovableView[] = [
    new MovableView(new SceneDemo(), ['expanded']),
    new MovableView(new SvgDemo(), [`i0`]),
    new MovableView(new SvgDemo(), [`i1`]),
    new MovableView(new SvgDemo(), [`i2`]),
  ];
  @observable public expanded = 0;

  @action public expand(index: number) {
    if (index === this.expanded) {
      return;
    }

    this.movable.forEach(item => {
      const i = item.classes.indexOf('collapsed');
      if (i !== -1) {
        item.classes.splice(i, 1);
      }
    });

    const itemToExpand = this.movable[index];
    const itemToCollapse = this.movable[this.expanded];

    itemToCollapse.classes = [...itemToExpand.classes, 'collapsed'];
    itemToExpand.classes = ['expanded'];

    this.expanded = index;
  }
}
