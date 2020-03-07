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
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

import { ConvexView as Model } from '@/modules/convex-view';

@Observer
@Component
export default class ConvexView extends Vue {
  @Prop() private model!: Model;
}
</script>
