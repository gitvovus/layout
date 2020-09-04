<template>
  <ui-dialog class="effect">
    <div class="w-panel">
      <div class="w-header">Convex Hull &amp; Offset</div>
      <div class="w-content convex-wrapper">
        <ui-svg-element :model="model.root" />
        <div>
          <ui-slider v-model="model.pointCount" :min="0" :max="model.points.length" style="width: 150px" />
        </div>
      </div>
      <div class="w-footer"></div>
    </div>
  </ui-dialog>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ConvexDemo as Model } from '@/modules/convex-demo';

@Observer
@Component
export default class ConvexDemo extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
.convex-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
