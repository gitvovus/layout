<template>
  <div class="movable-view" :class="[...model.classes]">
    <component :is="model.content.template" :model="model.content" />
    <slot />
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Movable as Model } from '@/modules/movable';

@Observer
@Component
export default class MovableView extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
$t: 1s;

.movable-view {
  position: absolute;
  transition: left $t, top $t, width $t, height $t;
}
</style>
