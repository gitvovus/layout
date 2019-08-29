<template>
<div class="floating" :style="{ left: `${controller.left}px`, top: `${controller.top}px`, width: `${controller.width}px`, height: `${controller.height}px` }">
  <div class="floating-panel">
    <div class="nw-resize"></div>
    <div class="nn-resize"></div>
    <div class="ne-resize"></div>
    <div class="ww-resize"></div>
    <div class="floating-content"><slot/></div>
    <div class="ee-resize"></div>
    <div class="sw-resize"></div>
    <div class="ss-resize"></div>
    <div class="se-resize"></div>
  </div>
</div>
</template>

<script lang="ts">
import { reaction } from 'mobx';
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Controller } from '@/ui/floating-controller';

@Observer
@Component
export default class Floating extends Vue {
  @Prop() private left!: number;
  @Prop() private top!: number;
  @Prop() private width!: number;
  @Prop() private height!: number;
  private controller!: Controller;
  private disposers!: Array<() => void>;

  private created() {
    this.controller = new Controller();
  }

  private mounted() {
    if (this.left !== undefined) {
      this.controller.left = this.left;
    }
    if (this.top !== undefined) {
      this.controller.top = this.top;
    }
    if (this.width !== undefined) {
      this.controller.width = this.width;
    }
    if (this.height !== undefined) {
      this.controller.height = this.height;
    }
    this.controller.mount(<HTMLElement> this.$el);
    this.disposers = [
      reaction(
        () => [this.controller.width, this.controller.height],
        () => this.$emit('resize'),
        { fireImmediately: true },
      ),
    ];
  }

  private beforeDestroy() {
    this.disposers.forEach(disposer => disposer());
    this.disposers = [];
    this.controller.unmount();
  }
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.floating {
  position: fixed;
  border-radius: $w-radius;
  z-index: $z-window;
}
.floating-panel {
  display: grid;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: -$w-resize;
  grid-template-columns: $w-resize * 2 auto $w-resize * 2;
  grid-template-rows: $w-resize * 2 auto $w-resize * 2;
}
.floating-content {
  box-shadow: $w-shadow;
  z-index: 1;
  margin: -$w-resize;
  border-radius: $w-radius;
  overflow: auto;
  cursor: auto;
}
</style>
