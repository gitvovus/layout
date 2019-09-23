import { action, observable } from 'mobx';

export class Controls {
  // buttons
  @observable public buttons = false;
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
  public paragraphs = [1, 2, 4, 8];
  @observable public selectedParagraphs = 0;
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
