<template>
  <div class="app svg">
    <svg width="50%" height="50%" viewBox="-5 -5 10 10" transform="scale(1 -1)">
      <defs>
        <pattern id="chess-pattern" viewBox="-1 -1 2 2" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect x="-1" y="-1" width="1" height="1" fill="#c0c0c0" />
          <rect x="0" y="-1" width="1" height="1" fill="white" />
          <rect x="-1" y="0" width="1" height="1" fill="white" />
          <rect x="0" y="0" width="1" height="1" fill="#c0c0c0" />
        </pattern>
      </defs>
      <rect
        x="-5"
        y="-5"
        width="10"
        height="10"
        rx="1"
        fill="url(#chess-pattern)"
        stroke="black"
        vector-effect="non-scaling-stroke"
      />
      <path
        d="M 0,2 A 2,2 0,0,1 -4,2 Q -4,-1 0,-4 Q 4,-1 4,2 A 2,2 0,0,1 0,2 z"
        fill="red"
        stroke="black"
        opacity="0.5"
        vector-effect="non-scaling-stroke"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { SvgDrawing as Model } from '@/modules/svg-drawing';

@Observer
@Component
export default class SvgDrawingView extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
.app.svg {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
