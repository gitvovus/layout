import { action, observable } from 'mobx';

import { Movable } from '@/modules/movable';
import { SvgDemo } from '@/modules/svg-demo';
import { ViewModel } from '@/modules/view-model';

export class MovableDemo implements ViewModel {
  public readonly template = 'movable-demo-view';
  @observable public readonly movable: Movable[] = [
    new Movable(new SvgDemo(), ['expanded']),
    new Movable(new SvgDemo(), [`i0`]),
    new Movable(new SvgDemo(), [`i1`]),
    new Movable(new SvgDemo(), [`i2`]),
    new Movable(new SvgDemo(), [`i3`]),
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
