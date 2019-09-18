import { action, observable } from 'mobx';

export class Controls {
  // buttons
  @observable public index = 3;
  @observable public items = [...Array(4)].map((item, i) => ({ name: `item #${i}`, value: i }));
  @observable public selectedItem = this.items[2];
  @observable public group = [false, true, false, false];
  @observable public message = 'nothing';

  // popup
  @observable public popup = false;
  @observable public text = 'text';

  // expand
  @observable public expanded = false;
  @observable public expandedGroup?: number = undefined;

  @action public unstyled() {
    this.message = 'unstyled';
  }

  @action public ok() {
    this.message = 'ok';
  }

  @action public cancel() {
    this.message = 'cancel';
  }
}
