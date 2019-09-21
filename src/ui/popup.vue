<template>
<div :class="['popup', { show: value }]" @focusout="focusout" tabindex="-1">
  <slot/>
</div>
</template>

<script lang="ts">
// related useful information:
// https://www.freecodecamp.org/news/mostly-css-drop-down-combo-boxes-4ff4bb182ff7/
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Observer
@Component
export default class UiPopup extends Vue {
  @Prop() private value!: boolean;

  @Watch('value')
  private show(show: boolean) {
    if (show) {
      Vue.nextTick(() => (this.$el as HTMLElement).focus());
    }
  }

  private focusout(e: FocusEvent) {
    const el = this.$el as HTMLElement;
    let focused = e.relatedTarget as HTMLElement | null;
    while (focused) {
      if (focused === el) {
        return;
      }
      focused = focused.parentElement;
    }
    this.$emit('input', false);
  }
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.popup {
  position: absolute;
  display: none;
  outline: none;
  box-shadow: $popup-shadow;
  z-index: 1;
  &.dark {
    background-color: $bg-dark;
  }
  &.lite {
    background-color: $bg-lite;
  }
  &.show {
    display: block;
  }
}
</style>
