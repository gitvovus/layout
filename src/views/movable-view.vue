<template>
  <div :class="['movable-view', ...model.classes]">
    <svg-view :model="model.view" />
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

import { Movable as Model } from '@/modules/movable';

@Observer
@Component
export default class MovableView extends Vue {
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
