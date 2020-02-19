<template>
  <div class="accordion">
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Observer
@Component
export default class UiAccordion extends Vue {
  @Prop() private expanded!: boolean;
  private trackResizeDisposer!: () => void;

  private mounted() {
    this.trackResizeDisposer = this.trackResize();
  }

  private beforeDestroy() {
    this.trackResizeDisposer();
  }

  private trackResize() {
    let id = 0;
    const frameHandler = () => {
      id = requestAnimationFrame(frameHandler);
      this.expand(this.expanded);
    };
    frameHandler();
    return () => cancelAnimationFrame(id);
  }

  @Watch('expanded')
  private expand(expand: boolean) {
    const el = this.$el as HTMLElement;
    const height = expand ? (el.firstChild as HTMLElement).scrollHeight + 'px' : '';
    if (el.style.height !== height) {
      el.style.height = height;
    }
  }
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.accordion {
  height: 0;
  overflow: hidden;
  transition: height $transition;
}
</style>
