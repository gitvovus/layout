<template>
<div class="scroller">
  <div class="run-track">
    <div class="run" :style="{ height: 100 * (value - min) / (max - min) + '%' }"></div>
    <div class="run-shadow"></div>
  </div>
  <div class="thumb-track">
    <div class="thumb" :style="{ bottom: 100 * (value - min) / (max - min) + '%' }"></div>
  </div>
  <input type="range" orient="vertical" :min="min" :max="max" :value="value" @input="input"/>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import UiSlider from '@/ui/slider.vue';

@Observer
@Component
export default class UiScroller extends UiSlider {}
</script>

<style lang="scss">
$scroller-width: 21px;
$track-width: 7px;

$thumb-width: 15px;
$thumb-height: 11px;

.scroller {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: $scroller-width;
  height: 100%;

  & .run-track {
    position: absolute;
    left: ($scroller-width - $track-width) / 2;
    top: 0;
    bottom: 0;
    width: $track-width;
    border-radius: 50vw;
    overflow: hidden;
  }

  & .run {
    position: absolute;
    width: 100%;
    bottom: 0;
    background-color: red;
  }

  & .run-shadow {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 50vw;
    box-shadow: 0 0 0.4vw black inset;
  }

  & .thumb-track {
    position: absolute;
    left: 0;
    top: $thumb-height;
    bottom: 0;
  }

  & .thumb {
    position: absolute;
    left: ($scroller-width - $thumb-width) / 2;
    width: $thumb-width;
    height: $thumb-height;
    border-radius: 50vw;
    background-color: silver;
    border: 2px solid white;
    box-shadow: 0 0 1px black;
  }

  & input {
    -webkit-appearance: slider-vertical;
    writing-mode: bt-lr;
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
  }
}
</style>
