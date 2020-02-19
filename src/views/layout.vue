<template>
  <div class="l-root">
    <div class="l-header">
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="spacer"></div>
      <div class="item"></div>
      <div class="item"></div>
    </div>
    <div class="l-main">
      <div class="l-wrapper">
        <div class="l-views">
          <div class="l-view-slot">
            <div class="l-view" @click="toggleExpanded">
              <div class="row"></div>
              <div class="col"></div>
              <div class="fit"></div>
              <div class="col"></div>
            </div>
          </div>
          <div class="l-view-slot">
            <div class="l-view" @click="toggleExpanded"></div>
          </div>
          <div class="l-view-slot">
            <div class="l-view" @click="toggleExpanded"></div>
          </div>
        </div>
        <div class="l-view-3d">
          <div class="row"></div>
          <div class="col"></div>
          <div class="fit"></div>
          <div class="col"></div>
          <div class="col"></div>
        </div>
      </div>
      <div class="l-tools">
        <div class="row"></div>
        <div class="col"></div>
        <div class="fit"></div>
        <div class="col"></div>
        <div class="col"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { toggleExpanded } from '@/modules/animations';

@Component
export default class Layout extends Vue {
  private wrapper!: HTMLElement;

  private mounted() {
    this.wrapper = this.$el.getElementsByClassName('l-wrapper')[0] as HTMLElement;
  }

  private toggleExpanded(e: Event) {
    toggleExpanded(e.currentTarget as HTMLElement, this.wrapper, 0.3);
  }
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.l-root {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  @include frame(white);
}
.l-header {
  display: flex;
  @include frame(red);
}
.l-main {
  flex: 1 1 0;
  display: flex;
  min-width: 0;
  min-height: 0;
  @include frame(black);
}
.l-wrapper {
  position: relative;
  flex: 1 1 0;
  display: flex;
  min-width: 0;
  min-height: 0;
  @include frame(white);
}
.l-views {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  @include frame(blue);
}
.l-view-slot {
  flex: 1 1 0;
  display: flex;
  overflow: hidden;
  @include frame(white);
}
.l-view {
  position: relative;
  flex: 1 1 0;
  overflow: hidden;
  background-color: rgba(black, 0.5);
  @include frame(red);
}
.l-view.expanded {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.l-view-3d {
  position: relative;
  flex: 3 3 0;
  overflow: hidden;
  @include frame(red);
}
.l-tools {
  width: 250px;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  @include frame(red);
}

@mixin item($content) {
  margin: 5px;
  border-radius: 5px;
  border: 1px solid rgba(white, 0.5);
  background-color: rgba(black, 0.5);
  &::after {
    content: $content;
    color: white;
    font-size: 12px;
    margin: 0 5px;
  }
}

.item {
  width: 50px;
  height: 50px;
  @include item('50');
}
.row {
  width: 900px;
  height: 50px;
  @include item('900');
}
.col {
  width: 50px;
  height: 200px;
  @include item('200');
}
.fit {
  height: 50px;
  @include item('fit');
}
</style>
