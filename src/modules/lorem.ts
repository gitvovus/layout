import { observable } from 'mobx';

import { ViewModel } from '@/modules/view-model';

export class Lorem implements ViewModel {
  public template = 'lorem-view';
  @observable public paragraphs?: number;

  public constructor(paragraphs?: number) {
    this.paragraphs = paragraphs;
  }
}
