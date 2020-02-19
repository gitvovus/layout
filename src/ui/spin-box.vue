<template>
  <div class="spin-box">
    <div class="container">
      <div class="items">
        <input type="text" v-model="text" @keypress="onKeyPress" />
        <div class="buttons">
          <ui-button no-focus tabindex="-1" class="light" @click="up">
            <div class="icon icon-up"></div>
          </ui-button>
          <ui-button no-focus tabindex="-1" class="light" @click="down">
            <div class="icon icon-down"></div>
          </ui-button>
        </div>
        <div class="mark">%</div>
      </div>
      <div class="label">Zoom level</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Observer
@Component
export default class UiSpinBox extends Vue {
  @Prop() private value!: number;
  @Prop() private values!: number[];
  private textValue = '';

  public get text() {
    return this.textValue;
  }

  public set text(value: string) {
    this.textValue = value;
  }

  private mounted() {
    this.textValue = this.value.toString();
  }

  private get upDisabled() {
    return this.value >= this.values[this.values.length - 1];
  }

  private get dnDisabled() {
    return this.value <= this.values[0];
  }

  @Watch('value')
  private onValueChanged(value: number) {
    this.textValue = value.toString();
  }

  private onKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.apply(this.textValue);
    }
  }

  private apply(text: string) {
    const num = Number.parseFloat(text);
    if (!isNaN(num)) {
      this.$emit('input', num);
    } else {
      this.textValue = this.value.toString();
    }
  }

  private up() {
    if (this.value < this.values[this.values.length - 1]) {
      for (const value of this.values) {
        if (value <= this.value) {
          continue;
        }
        this.$emit('input', value);
        break;
      }
    }
  }

  private down() {
    if (this.value > this.values[0]) {
      for (let i = this.values.length - 1; i >= 0; --i) {
        if (this.values[i] >= this.value) {
          continue;
        }
        this.$emit('input', this.values[i]);
        break;
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.spin-box {
  display: inline-block;
  margin: 0 10px 0 0;
  padding: 5px 5px 0 5px;
  width: 6em;
  background-color: rgba(white, 0.2);
  border-radius: 5px;

  & .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  & .items {
    display: flex;
    justify-content: stretch;
    width: 100%;
    background-color: rgba(black, 0.05);
    border-radius: 50vh;
  }

  & input[type='text'] {
    background: none;
    border: none;
    outline: none;
    padding: 3px 2px 3px 0.75em;
    min-width: 0;
  }

  & .buttons {
    display: flex;
    flex-direction: column;
  }

  & .button {
    margin: 0;
    padding: 0;
    width: 16px;
    flex-grow: 1;
    height: 100%;
    padding: 0 2px;
    &:hover {
      padding: 0 1px;
    }
    &:hover:active {
      padding: 0 2px;
    }
  }

  & .icon {
    background-color: $text-light;
  }

  & .mark {
    background-color: rgba(black, 0.1);
    border-radius: 0 50vh 50vh 0;
    padding: 3px 5px 3px 3px;
  }

  & .label {
    line-height: 150%;
  }
}
</style>
