<template>
  <div :class="['popup', { show: value }]" @click="click" @focusout="focusout" tabindex="-1">
    <slot />
  </div>
</template>

<script lang="ts">
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
      const element = this.$el as HTMLElement;
      const parent = element.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        element.style.left = rect.left + 'px';
        element.style.top = rect.top + 'px';
      }
      Vue.nextTick(() => element.focus());
    }
  }

  private click(e: Event) {
    let target = e.target as HTMLElement | null;
    while (target && target !== e.currentTarget) {
      if (target.classList.contains('action')) {
        this.$emit('input', false);
        return;
      }
      target = target.parentElement;
    }
  }

  private focusout(e: FocusEvent) {
    const element = this.$el as HTMLElement;
    let target = e.relatedTarget as HTMLElement | null;
    while (target) {
      if (target === element) {
        return;
      }
      target = target.parentElement;
    }
    this.$emit('input', false);
  }

  private mounted() {
    this.show(this.value);
  }
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.popup {
  position: fixed;
  display: none;
  outline: none;
  box-shadow: $popup-shadow;
  z-index: 1;
  &.show {
    display: block;
  }
}
</style>
