<template>
  <div class="event-tracker-view">
    <div class="event-tracker-info">
      <div>
        {{ model.leftButton ? 'L' : '-' }}
        {{ model.rightButton ? 'R' : '-' }}
        {{ model.middleButton ? 'M' : '-' }}
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
      <div class="event-tracker-child"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

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
  border-radius: 5px;
  background-color: rgba(black, 1/2);
  display: flex;
  flex-direction: column;
  pointer-events: none;
}
.event-tracker-parent {
  position: absolute;
  right: 0;
  top: 0;
  border-radius: 5px;
  background-color: rgba(black, 1/4);
  margin: 5px;
  padding: 50px;
}
.event-tracker-child {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  background-color: rgba(yellow, 1/4);
}
</style>
