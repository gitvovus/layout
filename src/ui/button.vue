<template>
  <button class="button" :checked="checked" @pointerdown.stop @click="click" @focus="focus">
    <slot />
  </button>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Observer
@Component
export default class UiButton extends Vue {
  @Prop() private value: any;
  @Prop() private toggle: undefined | '' | [any] | [any, any];
  @Prop() private noFocus: undefined | '';

  private get checked() {
    if (this.toggle === undefined) {
      return false;
    } else {
      if (this.toggle === '') {
        return this.value === true;
      } else {
        return this.value === this.toggle[0];
      }
    }
  }

  private click(e: Event) {
    if (this.toggle === undefined) {
      this.$emit('click', e);
    } else if (this.toggle === '') {
      this.$emit('input', this.value ? false : true);
    } else if (this.toggle.length === 1) {
      if (this.value !== this.toggle[0]) {
        this.$emit('input', this.toggle[0]);
      }
    } else if (this.toggle.length === 2) {
      this.$emit('input', this.value === this.toggle[0] ? this.toggle[1] : this.toggle[0]);
    }
  }

  private focus(e: FocusEvent) {
    if (this.noFocus !== undefined) {
      e.preventDefault();
      (this.$el as HTMLElement).blur();
      if (e.relatedTarget && (e.relatedTarget as any).focus) {
        (e.relatedTarget as any).focus();
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

@mixin tint($tint) {
  &[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
  &.outline {
    border-color: rgba($tint, 2/16);
  }
  &:focus {
    border-color: rgba($tint, 4/16);
  }
  &[checked] {
    background-color: rgba($tint, 2/16);
  }
  &:hover:not([checked]) {
    background-color: rgba($tint, 1/16);
  }
  &:hover[checked] {
    background-color: rgba($tint, 3/16);
  }
  &:active:hover {
    background-color: rgba($tint, 5/16);
  }
}

@mixin pretty(
  $primary,
  $alpha-border-focus-checked,
  $alpha-bg-hover-checked,
  $alpha-border-hover-checked,
  $alpha-bg-active,
  $alpha-border-active
) {
  color: $primary;
  $inverse: invert($primary);
  &:focus {
    border-color: rgba($primary, 1/8);
  }
  &[checked] {
    background-color: rgba(white, 1/4);
    border-color: rgba($inverse, 1/8);
    box-shadow: inset 0 0 5px -1px rgba(black, 1/2);
    text-shadow: 0 0 3px $inverse;
  }
  &:focus[checked] {
    border-color: rgba(white, $alpha-border-focus-checked);
  }
  &:hover:not([checked]) {
    background-color: rgba($primary, 1/16);
    border-color: rgba($primary, 1/8);
  }
  &:hover[checked] {
    background-color: rgba(white, $alpha-bg-hover-checked);
    border-color: rgba(white, $alpha-border-hover-checked);
  }
  &:active:hover {
    background-color: rgba($primary, $alpha-bg-active);
    border-color: rgba(white, $alpha-border-active);
    box-shadow: inset 0 0 5px -1px rgba(black, 1/2);
    color: $inverse;
    text-shadow: 0 0 3px $primary;
  }
}

.button {
  background: none;
  border: 1px solid transparent;
  color: inherit;
  outline: none;
  user-select: none;
  margin: 5px 3px;
  padding: 8px 12px;
  transition: background-color $transition, border-color $transition, box-shadow $transition, text-shadow $transition;

  @include tint(white);

  &.pretty {
    @include pretty(
      $primary: white,
      $alpha-border-focus-checked: 1/4,
      $alpha-bg-hover-checked: 1/8,
      $alpha-border-hover-checked: 1/8,
      $alpha-bg-active: 1/8,
      $alpha-border-active: 1/4
    );
  }
}
</style>
