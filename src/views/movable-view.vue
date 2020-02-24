<template>
  <div class="movable-view" :style="model.attributes">
    <svg-view :model="model.view" :style="{ left: '20px', top: '20px', right: '20px', bottom: '20px' }" />
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

  public mounted() {
    this.model.mount(this.$el as HTMLElement);
  }

  public beforeDestroy() {
    this.model.unmount();
  }
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
