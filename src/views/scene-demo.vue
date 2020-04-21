<template>
  <div class="scene-demo" tabindex="0">
    <canvas class="scene-viewport"></canvas>
    <slot />
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { SceneDemo as Model } from '@/modules/scene-demo';

@Observer
@Component
export default class SceneDemo extends Vue {
  @Prop() private model!: Model;

  private mounted() {
    this.model.mount(this.$el as HTMLElement, this.$el.getElementsByClassName('scene-viewport')[0] as HTMLCanvasElement);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>

<style lang="scss">
.scene-demo {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.scene-viewport {
  position: absolute;
  background-color: #d0e0f0;
}
</style>
