<template>
  <div class="event-tracker-view">
    <div class="event-tracker-info">
      <div>
        {{ model.leftButton ? 'L' : '-' }}
        {{ model.middleButton ? 'M' : '-' }}
        {{ model.rightButton ? 'R' : '-' }}
      </div>
      <div>type: {{ model.lastEvent }}</div>
      <div>clientX: {{ model.clientX }}</div>
      <div>clientY: {{ model.clientY }}</div>
      <div>deltaX: {{ model.deltaX }}</div>
      <div>deltaY: {{ model.deltaY }}</div>
      <div>deltaZ: {{ model.deltaZ }}</div>
      <div>deltaMode: {{ model.deltaMode }}</div>
    </div>
    <div class="event-tracker-parent">
      parent
      <div class="event-tracker-child">
        child
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { EventTracker as Model } from '@/modules/event-tracker';

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
@import '@/style/_vars.scss';

.event-tracker-view {
  position: absolute;
  overflow: hidden;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.event-tracker-info {
  position: absolute;
  font-family: monospace;
  left: 0;
  top: 0;
  min-width: 12em;
  margin: 5px;
  padding: 10px;
  border-radius: $r;
  background-color: rgba(black, 1/2);
  display: flex;
  flex-direction: column;
  pointer-events: none;
}
.event-tracker-parent {
  position: absolute;
  right: 0;
  top: 0;
  margin: 5px;
  padding: 10px;
  border-radius: $r;
  background-color: rgba(black, 1/4);
}
.event-tracker-child {
  width: 100px;
  height: 100px;
  margin: 10px;
  padding: 10px;
  border-radius: $r;
  background-color: rgba(green, 1/4);
}
</style>
