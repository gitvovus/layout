<template>
  <div class="view">
    <ui-svg-element class="overlay" tabindex="0" :model="model.root" />
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

import { View2d as Model } from '@/modules/view-2d';

@Observer
@Component
export default class View2d extends Vue {
  @Prop() private model!: Model;

  private mounted() {
    this.model.mount(this.$el as HTMLElement);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>
