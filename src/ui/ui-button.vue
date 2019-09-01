<template>
<button
  class="ui-btn"
  :class="[
    dark !== undefined ? 'dark' : 'lite',
  ]"
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
  @Prop() private toggle?: '' | [any] | [any, any];
  @Prop() private dark?: boolean;
  @Prop() private noFocus: any;

  private get checked() {
    if (this.toggle !== undefined) {
      if (this.toggle === '') {
        return this.value === true;
      } else {
        return this.value === this.toggle[0];
      }
    } else {
      return false;
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

$dark: black;
$lite: white;

@mixin tint($tint) {
  $negative: invert($tint);
  &:focus {
    border: 1px solid rgba($tint, 2/16);
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
  &.outline {
    box-shadow: 0 0 0 1px rgba($tint, 2/16);
  }
}

.ui-btn {
  background: none;
  border: 1px solid transparent;
  color: inherit;
  outline: none;
  user-select: none;

  margin: 5px;
  padding: 8px 12px;
}
.ui-btn.dark {
  @include tint(white);
}
.ui-btn.lite {
  @include tint(black);
}

.round {
  border-radius: 50vh;
}
</style>
