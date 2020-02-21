import { observable } from 'mobx';

import { View2d } from '@/modules/view-2d';

export class Mockup {
  @observable public dark = 0;
  @observable public light = 0;
  @observable public button = 0;
  @observable public test = false;
  @observable public views = true;
  public readonly view2d = new View2d();
}
