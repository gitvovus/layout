import { observable } from 'mobx';

import { ViewModel } from '@/modules/view-model';

export class Lorem implements ViewModel {
  public readonly template = 'lorem-view';
  public readonly key = Symbol();
  @observable public paragraphs?: number;

  public constructor(paragraphs?: number) {
    this.paragraphs = paragraphs;
  }
}
