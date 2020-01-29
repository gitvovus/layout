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

  // slider
  public sliderMin = 0;
  public sliderMax = 10;
  @observable public sliderValue = 5;

  // spin-box
  public spinValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  @observable public spinValue = 100;

  @action public click(message: string) {
    this.message = message;
  }

  @action public reset() {
    this.sliderValue = 5;
    this.spinValue = 10;
  }
}
