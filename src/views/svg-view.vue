<template>
<div class="svg-view">
  <ui-element class="overlay" tabindex="0" :model="model.root"/>
  <slot/>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

import { SvgView as Model } from '@/modules/svg-view';

@Observer
@Component
export default class SvgView extends Vue {
  @Prop() private model!: Model;

  private mounted() {
    this.model.mount(this.$el as HTMLElement);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>

<style lang="scss">
.svg-view {
  position: absolute;
  left: 10%;
  top: 10%;
  right: 10%;
  bottom: 10%;
  background-color: rgba(white, 0.5);
  box-shadow: 0 0 50px black;
}
</style>
