<template>
<div :class="['popup']" @blur="hide" tabindex="-1">
  <slot/>
</div>
</template>

<script lang="ts">
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
  private focus(show: boolean) {
    if (show) {
      (this.$el.parentElement as HTMLElement).focus();
      // Vue.nextTick(() => (this.$el as HTMLElement).focus());
    }
  }

  private hide() {
    // console.log(document.activeElement!.tagName);
    // this.$emit('input', false);
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
  &:focus-within {
    display: block;
  }
}

.popup-anchor:focus-within .popup {
  display: block;
}

</style>
