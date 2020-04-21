<template>
  <div class="svg-tool" tabindex="0">
    <div class="container">
      <ui-svg-element class="overlay" :model="model.root" />
    </div>
    <div class="preview">
      <template v-for="size in [64, 32]">
        <template v-for="color in ['white', 'grey', 'black']">
          <div :class="['use-case', color]" :key="`${color}-${size}`">
            <svg :width="size" :height="size" viewBox="0 0 64 64">
              <use :href="`#${model.selectedItem.attributes.id}`" />
            </svg>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { IconTool as Model } from '@/modules/icon-tool';

@Observer
@Component
export default class IconTool extends Vue {
  @Prop() private model!: Model;

  private mounted() {
    this.model.mount(this.$el as HTMLElement);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>
