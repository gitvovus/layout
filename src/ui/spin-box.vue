<template>
<div class="spin-box">
  <div class="spin-box-items">
    <input type="text" v-model="text" @keypress="onKeyPress"/>
    <div class="spin-box-buttons">
      <ui-button no-focus tabindex="-1" class="round light outline icon-wrapper" @click="up">
        <div class="icon light icon-up"></div>
      </ui-button>
      <ui-button no-focus tabindex="-1" class="round light outline icon-wrapper" @click="down">
        <div class="icon light icon-down"></div>
      </ui-button>
    </div>
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
      this.$emit('input', num)
    } else {
      this.textValue = this.value.toString();
    }
  }

  private up() {
    console.log('up');
    if (this.value < this.values[this.values.length - 1]) {
      for (let i = 0; i < this.values.length; ++i) {
        if (this.values[i] <= this.value) {
          continue;
        }
        this.$emit('input', this.values[i]);
        break;
      }
    }
  }

  private down() {
    console.log('down');
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
.spin-box {
  display: inline-block;
}
.spin-box-items {
  display: flex;
}
.spin-box-buttons {
  display: flex;
  flex-direction: column;
}
.spin-box.button {
  margin: 0;
  padding: 0;
}
</style>
