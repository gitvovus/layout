<template>
  <div class="svg-demo-view">
    <ui-svg-element class="overlay" :model="model.root" />
    <slot />
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { SvgDemo as Model } from '@/modules/svg-demo';

@Observer
@Component
export default class SvgDemoView extends Vue {
  @Prop() private model!: Model;

  private mounted() {
    this.model.mount(this.$el as HTMLElement);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>

<style lang="scss">
.svg-demo-view {
  position: absolute;
  overflow: hidden;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
