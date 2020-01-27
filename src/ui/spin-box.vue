<template>
<div class="spin-box">
  <div class="spin-box-items">
    <input type="text" v-model="text" @keypress="onKeyPress"/>
    <div class="spin-box-buttons">
      <ui-button class="spin-box" :disabled="upDisabled">up</ui-button>
      <ui-button class="spin-box" :disabled="dnDisabled">dn</ui-button>
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
      console.log(e);
      const num = Number.parseFloat(this.textValue);
      if (!isNaN(num)) {
        this.$emit('input', num)
      } else {
        this.textValue = this.value.toString();
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
