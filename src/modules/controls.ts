import { action, observable } from 'mobx';

import { Lorem } from '@/modules/lorem';

class ListItem {
  public readonly name: string;
  @observable public value = 5;

  public constructor(name: string) {
    this.name = name;
  }
}

export class Controls {
  public readonly lorem = new Lorem(1);
  public paragraphs = [1, 2, 4, 8];

  // buttons
  @observable public buttons = false;
  @observable public index = 3;
  @observable public items = [...Array(4)].map((item, i) => ({
    name: `item #${i}`,
    value: i,
  }));
  @observable public selectedItem = this.items[2];
  @observable public group = [false, true, false, false];
  @observable public message = 'nothing';

  // popup
  @observable public popup = false;
  @observable public text = 'text';

  // expand
  @observable public expanded = false;
  @observable public expandedGroup?: number = undefined;

  // slider & spin-box
  public sliderMin = 10;
  public sliderMax = 50;
  public spinValues = [10, 20, 30, 40, 50];
  @observable public spinValue = 30;

  @observable public readonly list = [new ListItem('First'), new ListItem('Second')];

  @action public click(message: string) {
    this.message = message;
  }

  @action public reset() {
    this.spinValue = 30;
  }
}
