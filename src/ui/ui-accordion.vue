<template>
<div class="accordion">
  <slot/>
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

  @Watch('expanded')
  private expand(expand: boolean) {
    const el = this.$el as HTMLElement;
    el.style.maxHeight = expand ? el.scrollHeight + 'px' : null;
  }
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.accordion {
  max-height: 0;
  overflow: hidden;
  transition: max-height $transition;
}
</style>
