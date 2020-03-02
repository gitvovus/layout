<template>
  <div class="resizer">
    <slot name="header" />
    <slot name="content" />
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Observer
@Component
export default class UiResizer extends Vue {
  private mounted() {}
  private beforeDestroy() {}
}
</script>
