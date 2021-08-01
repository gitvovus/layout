<template>
  <div class="hero-view">
    <div>Hero</div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Hero as Model } from '@/modules/hero';

@Observer
@Component
export default class HeroView extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
.hero-view {
  position: absolute;
  overflow: hidden;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
