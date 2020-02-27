<template>
  <div class="svg-view">
    <ui-svg-element class="overlay" :model="model.root" />
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

import { SvgView as Model } from '@/modules/svg-view';

@Observer
@Component
export default class SvgView extends Vue {
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
@import '@/style/_vars.scss';

.svg-view {
  position: absolute;
  overflow: hidden;
  background-color: rgba(ivory, 0.75);
  border-radius: 8px;
  box-shadow: $w-shadow;
}
</style>
