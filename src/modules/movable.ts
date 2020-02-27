import { observable } from 'mobx';

import { SvgView } from '@/modules/svg-view';

export class Movable {
  public readonly view: SvgView;
  @observable public classes: string[];

  public constructor(view: SvgView, classes: string[]) {
    this.view = view;
    this.classes = classes;
  }
}
