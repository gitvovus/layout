<template>
  <div class="app">
    <movable-view v-for="(item, i) in model.movable" :key="i" :model="item" class="movable">
      <div class="anchor right bottom" v-if="i !== model.expanded">
        <ui-button no-focus tabindex="-1" class="icon-wrapper" @click="model.expand(i)">
          <div class="icon icon-expand"></div>
        </ui-button>
      </div>
    </movable-view>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { MovableDemo as Model } from '@/modules/movable-demo';

@Observer
@Component
export default class MovableDemoView extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
.movable {
  left: 0;
  width: 30%;
  height: 33.3333%;
  z-index: 1;
  &.i0 {
    top: 0;
  }
  &.i1 {
    top: 33.3333%;
  }
  &.i2 {
    top: 66.6666%;
  }
  &.expanded {
    left: 30%;
    top: 0;
    width: 70%;
    height: 100%;
    z-index: 2;
  }
  &.collapsed {
    z-index: 0;
  }
}
</style>
