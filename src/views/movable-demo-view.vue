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
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

import { MovableDemo as Model } from '@/modules/movable-demo';

@Observer
@Component
export default class MovableDemoView extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

$t: 1s;

.movable-view {
  position: absolute;
  transition: left $t, top $t, width $t, height $t;
}
</style>
