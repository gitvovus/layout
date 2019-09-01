<template>
  <v-component v-if="model.tag !== '#text'" :is="model.tag" v-bind="model.attributes">
    <ui-element v-for="(item, index) in model.items" :key="item.symbol" :model="model.items[index]"/>
  </v-component>
  <ui-text v-else :model="model"/>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import { Item } from '@/lib/svg';

@Observer
@Component
export default class UiElement extends Vue {
  @Prop() private model!: Item;

  private mounted() {
    this.model.mount(<SVGElement> this.$el);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>
