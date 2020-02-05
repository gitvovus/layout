<template>
<div class="scroller">
  <input type="range" :min="min" :max="max" :value="value" @input="input"/>
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
$scroller-width: 16px;

.scroller {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: $scroller-width;
  height: 100px;
  background-color: red;

  & input {
    -webkit-appearance: slider-vertical;
    writing-mode: bt-lr;
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    // opacity: 0;
  }
}
</style>
