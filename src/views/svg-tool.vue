<template>
  <div class="svg-tool">
    <div class="container">
      <svg class="overlay" :viewBox="`${x - 1} ${y - 1} ${w + 2} ${h + 2}`">
        <defs>
          <linearGradient id="svg-cursor-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: #ffffff;" />
            <stop offset="100%" style="stop-color: #e0e0e0;" />
          </linearGradient>
          <filter id="svg-cursor-shadow" x="-1" y="-1" width="3" height="3">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="5" dy="2" result="shadow" />
            <feFlood flood-color="black" flood-opacity="0.3" result="color" />
            <feComposite in="color" operator="in" in2="shadow" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="svg-tool-pattern" viewBox="-1 -1 2 2" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect x="-1" y="-1" width="1" height="1" fill="#c0c0c0" />
            <rect x="0" y="-1" width="1" height="1" fill="#a0a0a0" />
            <rect x="-1" y="0" width="1" height="1" fill="#a0a0a0" />
            <rect x="0" y="0" width="1" height="1" fill="#c0c0c0" />
          </pattern>
          <!-- prettier-ignore -->
          <path
          id="current"
          class="svg-cursor"
          d="M 1 1 L 25.1 25.1 L 23.2 27 22.5 27 L 15.5 27 L 19.6 35.2 C 20.7 37.4 14.7 40.4 13.7 38.4 L 9.25 29 L 3.25 35 L 1 35 z"
        />
          <!-- prettier-ignore -->
          <path
          id="default"
          class="svg-cursor"
          d="M 1 1 L 25.1 25.1 L 23.2 27 22.5 27 L 15.5 27 L 19.6 35.2 C 20.7 37.4 14.7 40.4 13.7 38.4 L 9.25 29 L 3.25 35 L 1 35 z"
        />
          <!-- prettier-ignore -->
          <path
          id="default-big"
          class="svg-cursor"
          d="M 1 1 L 36 36 L 34 38 L 22 38 L 30 54 L 22 58 L 13.5 41 L 4 50.5 L 1 50.5 z"
        />
          <!-- prettier-ignore -->
          <path
          id="rotate"
          class="svg-cursor"
          d="
            M 9 39  L 1 28  L 1 27  L 6 27  A 22 22 0 0 1 41.2 9.4  L 37.6 14.2 A 16 16 0 0 0 12 27 L 17 27 L 17 28 z
            M 47 15 L 55 26 L 55 27 L 50 27 A 22 22 0 0 1 14.8 44.6 L 18.4 39.8 A 16 16 0 0 0 44 27 L 39 27 L 39 26 z
          "
        />
          <!-- prettier-ignore -->
          <path
          id="horizontal"
          class="svg-cursor"
          d="M 1 32 L 14 43 L 15 43 L 15 35 L 43 35 L 43 43 L 44 43 L 57 32 L 44 21 L 43 21 L 43 29 L 15 29 L 15 21 L 14 21 z"
        />
          <!-- prettier-ignore -->
          <path
          id="vertical"
          class="svg-cursor"
          d="M 32 1 L 43 14 L 43 15 L 35 15 L 35 43 L 43 43 L 43 44 L 32 57 L 21 44 L 21 43 L 29 43 L 29 15 L 21 15 L 21 14 z"
        />
        </defs>
        <rect :x="x - 1" :y="y - 1" :width="w + 2" :height="h + 2" fill="url(#svg-tool-pattern)" />
        <!-- <circle cx="28" cy="27" r="23.1" fill="red" stroke="none" />
        <circle cx="28" cy="27" r="14.9" fill="green" stroke="none" /> -->
        <use :href="cursor" />
      </svg>
    </div>
    <div class="preview" :style="{ cursor: native }">
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

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { SvgTool as Model } from '@/modules/svg-tool';

@Observer
@Component
export default class SvgTool extends Vue {
  @Prop() private model!: Model;
  private x = 0;
  private y = 0;
  private w = 64;
  private h = 64;
  private cursors = [
    { id: 'current', native: 'default' },
    { id: 'default', native: 'default' },
    { id: 'default-big', native: 'default' },
    { id: 'rotate', native: 'move' },
    { id: 'horizontal', native: 'ew-resize' },
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

<style lang="scss">
@import '@/style/_vars.scss';

.svg-tool {
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
.svg-cursor {
  stroke: black;
  stroke-width: 2;
  stroke-linejoin: round;
  fill: url(#svg-cursor-fill);
  filter: url(#svg-cursor-shadow);
}
.select {
  position: absolute;
  left: 0;
  top: 0;
  margin: 10px;
  display: flex;
  box-shadow: $shadow;
  & select {
    border: none;
    margin: 0;
  }
}
.svg-drawing-cursor {
  stroke: black;
  stroke-width: 2;
  stroke-linejoin: round;
  fill: url(#svg-drawing-gradient);
  filter: url(#svg-drawing-shadow);
}
.bg-check {
  display: flex;
  align-items: center;
  border-radius: $r;
  margin: 10px;
  overflow: hidden;
  box-shadow: $shadow;
}
.use-case {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
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
