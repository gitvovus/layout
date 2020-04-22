<template>
  <div class="movable-demo">
    <movable-view v-for="(item, i) in model.movable" :key="i" :model="item" class="movable">
      <div class="anchor right bottom" v-if="i !== model.expanded">
        <ui-button no-focus tabindex="-1" class="iconic" @click="model.expand(i)">
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
export default class MovableDemo extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
.movable-demo {
  position: absolute;
  overflow: hidden;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.movable {
  left: 0;
  width: 30%;
  height: (100% / 3);
  z-index: 1;
  &.i0 {
    top: 0;
  }
  &.i1 {
    top: (100% / 3);
  }
  &.i2 {
    top: (200% / 3);
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
