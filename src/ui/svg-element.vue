<template>
  <component v-if="model.tag !== '#text'" :is="model.tag" v-bind="model.attributes">
    <ui-svg-element v-for="item in model.items" :key="item.key" :model="item" />
  </component>
  <ui-svg-text v-else :model="model" />
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Item } from '@/lib/svg';

@Observer
@Component
export default class UiSvgElement extends Vue {
  @Prop() private model!: Item;

  private mounted() {
    this.model.mount(this.$el as SVGElement);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>
