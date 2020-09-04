<template>
  <div class="slider">
    <div class="run-track">
      <div class="run" :style="{ width: (100 * (value - min)) / (max - min) + '%' }"></div>
      <div class="run-shadow"></div>
    </div>
    <div class="thumb-track">
      <div class="thumb" :style="{ left: (100 * (value - min)) / (max - min) + '%' }"></div>
    </div>
    <input type="range" :min="min" :max="max" :value="value" @input="input" />
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

  private scrollHandler!: (e: Event) => void;

  private input(e: Event) {
    this.$emit('input', Number.parseFloat((e.target as HTMLInputElement).value));
  }

  private mounted() {
    this.scrollHandler = (e: Event) => this.scroll(e as WheelEvent);
    this.$el.addEventListener('wheel', this.scrollHandler, { passive: false });
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
$slider-height: 21px;
$track-height: 7px;

$thumb-width: 11px;
$thumb-height: 15px;

.slider {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  height: $slider-height;

  & .run-track {
    position: absolute;
    left: 0;
    top: ($slider-height - $track-height) / 2;
    right: 0;
    height: $track-height;
    border-radius: 50vh;
    overflow: hidden;
  }

  & .run {
    height: 100%;
    background-color: red;
  }

  & .run-shadow {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 50vh;
    box-shadow: 0 0 0.4vh black inset;
  }

  & .thumb-track {
    position: absolute;
    left: 0;
    right: $thumb-width;
  }

  & .thumb {
    position: absolute;
    top: ($slider-height - $thumb-height) / 2;
    width: $thumb-width;
    height: $thumb-height;
    border-radius: 50vh;
    background-color: silver;
    border: 2px solid white;
    box-shadow: 0 0 1px black;
  }

  & input {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
  }
}
</style>
