<template>
  <div class="app svg-drawing-view">
    <svg class="svg-drawing" width="80%" height="80%" :viewBox="`${x - 1} ${y - 1} ${w + 2} ${h + 2}`">
      <defs>
        <linearGradient id="svg-cursor-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #ffffff;" />
          <stop offset="100%" style="stop-color: #e0e0e0;" />
        </linearGradient>
        <filter id="svg-cursor-shadow" x="-1" y="-1" width="3" height="3">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="6" dy="2" result="shadow" />
          <feFlood flood-color="black" flood-opacity="0.3" result="color" />
          <feComposite in="color" operator="in" in2="shadow" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="chess-pattern" viewBox="-1 -1 2 2" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect x="-1" y="-1" width="1" height="1" fill="#c0c0c0" />
          <rect x="0" y="-1" width="1" height="1" fill="#a0a0a0" />
          <rect x="-1" y="0" width="1" height="1" fill="#a0a0a0" />
          <rect x="0" y="0" width="1" height="1" fill="#c0c0c0" />
        </pattern>
        <!-- prettier-ignore -->
        <path
          id="current"
          class="svg-cursor"
          d="M 1 1 L 24 24 C 25.25 25.25 24 27 22.5 27 L 15 27 L 19 35 C 20 37 14 40 13 38 L 8.75 29.5 L 3.75 34.5 C 3 35.25 1 35 1 33.5 z"
        />
        <!-- prettier-ignore -->
        <path
          id="default"
          class="svg-cursor"
          d="M 1 1 L 24 24 C 25.25 25.25 24 27 22.5 27 L 15 27 L 19 35 C 20 37 14 40 13 38 L 8.75 29.5 L 3.75 34.5 C 3 35.25 1 35 1 33.5 z"
        />
        <!-- prettier-ignore -->
        <path
          id="default-big"
          class="svg-cursor"
          d="M 1 1 L 36 36 L 34 38 L 22 38 L 30 54 L 22 58 L 13.5 41 L 4 50.5 L 1 50.5 z"
        />
        <!-- prettier-ignore -->
        <path
          id="vertical"
          class="svg-cursor"
          d="M 32 1 L 44 15 L 35 15 L 35 43 L 44 43 L 32 57 L 20 43 L 29 43 L 29 15 L 20 15 z"
        />
      </defs>
      <rect :x="x - 1" :y="y - 1" :width="w + 2" :height="h + 2" fill="url(#chess-pattern)" />
      <use :href="cursor" />
    </svg>
    <div class="bg-check" :style="{ cursor: native }">
      <template v-for="size in [64, 32]">
        <template v-for="color in ['white', 'grey', 'black']">
          <div :class="['use-case', color]" :key="`${color}-${size}`">
            <svg :width="size" :height="size" :viewBox="`${x} ${y} ${w} ${h}`">
              <use :href="cursor" />
            </svg>
          </div>
        </template>
      </template>
    </div>
    <div class="select">
      <select v-model="index">
        <option v-for="(item, index) in cursors" :key="index" :value="index">{{ item.id }}</option>
      </select>
    </div>
  </div>
</template>

<style lang="scss">
.app.svg-drawing-view {
  display: flex;
  align-items: baseline;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: grey;
}
.select {
  position: absolute;
  left: 0;
  top: 0;
  margin: 10px;
  display: flex;
  box-shadow: 0 0 5px rgba(black, 0.5);
  & select {
    border: none;
    margin: 0;
  }
}
.svg-drawing {
  margin-top: 50px;
}
.svg-cursor {
  stroke: black;
  stroke-width: 2;
  stroke-linejoin: round;
  fill: url(#svg-cursor-gradient);
  filter: url(#svg-cursor-shadow);
}
.bg-check {
  display: flex;
  align-items: center;
  height: 100px;
  border-radius: 5px;
  margin: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(black, 0.5);
}
.use-case {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  &.white {
    background-color: white;
  }
  &.grey {
    background-color: grey;
  }
  &.black {
    background-color: black;
  }
}
</style>

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
  private x = 0;
  private y = 0;
  private w = 64;
  private h = 64;
  private cursors = [
    { id: 'current', native: 'default' },
    { id: 'default', native: 'default' },
    { id: 'default-big', native: 'default' },
    { id: 'vertical', native: 'ns-resize' },
  ];
  private index = 0;

  private get cursor() {
    return `#${this.cursors[this.index].id}`;
  }

  private get native() {
    return this.cursors[this.index].native;
  }
}
</script>
