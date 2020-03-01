import { observable } from 'mobx';

import { ViewModel } from '@/modules/view-model';

export class Movable {
  public readonly content: ViewModel;
  @observable public classes: string[];

  public constructor(content: ViewModel, classes: string[]) {
    this.content = content;
    this.classes = classes;
  }
}
