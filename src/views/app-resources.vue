<template>
  <div class="app-resources">
    <svg>
      <defs>
        <linearGradient id="svg-cursor-fill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #ffffff" />
          <stop offset="100%" style="stop-color: #e0e0e0" />
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
        <pattern id="svg-grid-fill" viewBox="-1 -1 2 2" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect x="-1" y="-1" width="1" height="1" fill="#c0c0c0" />
          <rect x="0" y="-1" width="1" height="1" fill="#a0a0a0" />
          <rect x="-1" y="0" width="1" height="1" fill="#a0a0a0" />
          <rect x="0" y="0" width="1" height="1" fill="#c0c0c0" />
        </pattern>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default class AppResources extends Vue {}
</script>

<style lang="scss">
.app-resources {
  position: fixed;
  display: hidden;
  width: 0;
  height: 0;
}
.svg-cursor {
  stroke: black;
  stroke-width: 1.75;
  stroke-linejoin: round;
  fill: url(#svg-cursor-fill);
  filter: url(#svg-cursor-shadow);
}
</style>
