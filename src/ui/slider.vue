<template>
<div class="slider">
  <input type="range" :min="min" :max="max" :value="value" @input="input"/>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Observer
@Component
export default class UiSlider extends Vue {
  @Prop() private value!: number;
  @Prop() private min!: number;
  @Prop() private max!: number;

  private scrollHandler!: EventListener;

  private input(e: any) {
    this.$emit('input', Number.parseFloat(e.target.value));
  }

  private mounted() {
    this.scrollHandler = (e: Event) => this.scroll(e as WheelEvent);
    this.$el.addEventListener('wheel', this.scrollHandler);
  }

  private beforeDestroy() {
    this.$el.removeEventListener('wheel', this.scrollHandler);
  }

  private scroll(e: WheelEvent) {
    const dy = -Math.sign(e.deltaY);
    if (dy < 0 && this.value > this.min) {
      this.$emit('input', this.value - 1);
    } else if (dy > 0 && this.value < this.max) {
      this.$emit('input', this.value + 1);
    }
    e.stopPropagation();
    e.preventDefault();
  }
}
</script>

<style lang="scss">
.slider {
  position: relative;
  display: inline-block;
  min-width: 100px;
  border: 1px solid navy;
}
.slider input {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0.5;
}
</style>
