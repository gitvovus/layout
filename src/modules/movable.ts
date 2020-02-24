import { observable } from 'mobx';
import { SvgView } from './svg-view';

export type Attributes = {
  left?: string;
  top?: string;
  width?: string;
  height?: string;
  zIndex?: number;
};

export class Movable {
  @observable public attributes: Attributes = {};
  public position: number;
  public readonly view: SvgView;

  private el!: HTMLElement;

  public constructor(index: number, view: SvgView, attributes?: Attributes) {
    this.position = index;
    this.view = view;
    Object.assign(this.attributes, attributes);
  }

  public mount(el: HTMLElement) {
    this.el = el;
  }

  public unmount() {
    this.el = undefined!;
  }
}
