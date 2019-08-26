<template>
<button
  :class="dark !== undefined ? 'btn-toggle-dark' : 'btn-toggle-lite'"
  :checked="value === check"
  @click="click"
  @mousedown="mouseDown"
>
  <slot/>
</button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class BtnToggle extends Vue {
  @Prop() private value: any;
  @Prop() private check: any;
  @Prop() private uncheck: any;
  @Prop() private uncheckable: any;
  @Prop() private dark: any;
  @Prop() private noFocus: any;

  private click() {
    if (this.value !== this.check) {
      this.$emit('input', this.check);
    } else if (this.value !== this.uncheck && (this.uncheck !== undefined || this.uncheckable !== undefined)) {
      this.$emit('input', this.uncheck);
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
$btn-toggle-radius: 50vh;
$btn-toggle-padding: 8px 12px;

@mixin btn-toggle(
  $primary,
  $inverse,
  $alpha-border-focus-checked,
  $alpha-bg-hover-checked,
  $alpha-border-hover-checked,
  $alpha-bg-active,
  $alpha-border-active,
) {
  border: 1px solid transparent;
  background: none;
  border-radius: $btn-toggle-radius;
  color: $primary;
  outline: none;
  padding: $btn-toggle-padding;
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

.btn-toggle-dark {
  @include btn-toggle(
    $primary: white,
    $inverse: black,
    $alpha-border-focus-checked: 0.25,
    $alpha-bg-hover-checked: 0.125,
    $alpha-border-hover-checked: 0.125,
    $alpha-bg-active: 0.125,
    $alpha-border-active: 0.25,
  );
}

.btn-toggle-lite {
  @include btn-toggle(
    $primary: black,
    $inverse: white,
    $alpha-border-focus-checked: 1,
    $alpha-bg-hover-checked: 0.0625,
    $alpha-border-hover-checked: 0.75,
    $alpha-bg-active: 0.0625,
    $alpha-border-active: 1,
  );
}
</style>
