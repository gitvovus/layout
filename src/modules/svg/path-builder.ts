import { computed, observable } from 'mobx';

export class PathElement {
  public readonly id: string;
  @observable public precision = 2;

  @observable protected readonly values: number[] = [];

  public constructor(id: string) {
    this.id = id;
  }

  @computed public get text() {
    return `${this.id} ${this.values.map(value => value.toFixed(this.precision)).join(' ')}`;
  }
}

export class ClosePath extends PathElement {
  public constructor() {
    super('z');
  }
}

export class PointElement extends PathElement {
  public constructor(id: string, x: number, y: number) {
    super(id);
    this.values.push(x, y);
  }

  public get x() {
    return this.values[0];
  }

  public set x(value: number) {
    this.values[0] = value;
  }

  public get y() {
    return this.values[1];
  }

  public set y(value: number) {
    this.values[1] = value;
  }
}

export class AbsoluteMove extends PointElement {
  public constructor(x: number, y: number) {
    super('M', x, y);
  }
}

export class AbsoluteLine extends PointElement {
  public constructor(x: number, y: number) {
    super('L', x, y);
  }
}

export class PathBuilder {
  private readonly elements: PathElement[] = [];

  public push(...elements: PathElement[]) {
    this.elements.push(...elements);
  }

  public getText() {
    return this.elements.map(element => element.text).join(' ');
  }
}
