<template>
  <div class="icon-tool" tabindex="0">
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

<style lang="scss">
@import '@/style/_vars.scss';

.icon-tool {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: grey;
  & .container {
    position: relative;
    overflow: hidden;
    width: calc(100vh - 200px);
    height: calc(100vh - 200px);
    margin: 50px 0 20px;
    border-radius: $r;
    box-shadow: $shadow;
  }
  & .preview {
    display: flex;
    overflow: hidden;
    border: 1px solid orange;
    border-radius: $r;
    box-shadow: $shadow;
  }
}
</style>

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
