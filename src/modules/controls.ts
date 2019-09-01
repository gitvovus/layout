import { observable } from 'mobx';

export class Controls {
  @observable public index = 0;
  @observable public group = [false, false, false, false];
  @observable public items = [...Array(4)].map((item, i) => ({ name: `item #${i}`, value: i }));
  @observable public selectedItem = this.items[0];

  public ok() {
    console.log('ok');
  }

  public cancel() {
    console.log('cancel');
  }
}
