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

import { onAnimationFrame } from '@/lib/utils';

@Observer
@Component
export default class UiAccordion extends Vue {
  @Prop() private expanded!: boolean;
  private disposer!: () => void;

  private mounted() {
    this.disposer = onAnimationFrame(() => this.expand(this.expanded));
  }

  private beforeDestroy() {
    this.disposer();
  }

  @Watch('expanded')
  private expand(expanded: boolean) {
    const element = this.$el as HTMLElement;
    const height = expanded ? (element.firstChild as HTMLElement).scrollHeight + 'px' : '';
    if (element.style.height !== height) {
      element.style.height = height;
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
