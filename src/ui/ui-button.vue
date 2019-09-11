<template>
<button
  class="button"
  :checked="checked"
  @click="click"
  @mousedown="mouseDown"
>
  <slot/>
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

  private mouseDown(e: Event) {
    if (this.noFocus !== undefined) {
      e.preventDefault();
    }
  }
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

@mixin tint($tint) {
  &.outline {
    border: 1px solid rgba($tint, 2/16);
  }
  &:focus {
    border: 1px solid rgba($tint, 4/16);
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
  $inverse,
  $alpha-border-focus-checked,
  $alpha-bg-hover-checked,
  $alpha-border-hover-checked,
  $alpha-bg-active,
  $alpha-border-active,
) {
  color: $primary;
  &:focus {
    border: 1px solid rgba($primary, 0.125);
  }
  &[checked] {
    background-color: rgba(white, 0.25);
    border: 1px solid rgba($inverse, 0.125);
    box-shadow: inset 0 0 5px -1px rgba(black, 0.5);
    text-shadow: 0 0 3px $inverse;
  }
  &:focus[checked] {
    border: 1px solid rgba(white, $alpha-border-focus-checked);
  }
  &:hover:not([checked]) {
    background-color: rgba($primary, 0.0625);
    border: 1px solid rgba($primary, 0.125);
  }
  &:hover[checked] {
    background-color: rgba(white, $alpha-bg-hover-checked);
    border: 1px solid rgba(white, $alpha-border-hover-checked);
  }
  &:active:hover {
    background-color: rgba($primary, $alpha-bg-active);
    border: 1px solid rgba(white, $alpha-border-active);
    box-shadow: inset 0 0 5px -1px rgba(black, 0.5);
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
  margin: 5px;
  padding: 8px 12px;
  &.dark {
    @include tint(white);
  }
  &.lite {
    @include tint(black);
  }
  &.pretty-dark {
    @include pretty(
      $primary: white,
      $inverse: black,
      $alpha-border-focus-checked: 0.25,
      $alpha-bg-hover-checked: 0.125,
      $alpha-border-hover-checked: 0.125,
      $alpha-bg-active: 0.125,
      $alpha-border-active: 0.25,
    );
  }
  &.pretty-lite {
    @include pretty(
      $primary: black,
      $inverse: white,
      $alpha-border-focus-checked: 1,
      $alpha-bg-hover-checked: 0.0625,
      $alpha-border-hover-checked: 0.75,
      $alpha-bg-active: 0.0625,
      $alpha-border-active: 1,
    );
  }
}
</style>
