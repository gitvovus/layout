<template>
<div class="root">
  <div class="header">
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
    <div class="spacer"></div>
    <div class="item"></div>
    <div class="item"></div>
  </div>
  <div class="main">
    <div class="wrapper">
      <div class="views">
        <div class="view-slot">
          <div id="view-0" class="view" @click="expand">
            <div class="row"></div>
            <div class="col"></div>
            <div class="fit"></div>
            <div class="col"></div>
          </div>
        </div>
        <div class="view-slot"><div id="view-1" class="view" @click="expand"></div></div>
        <div class="view-slot"><div id="view-2" class="view" @click="expand"></div></div>
      </div>
      <div class="view">
        <div class="row"></div>
        <div class="col"></div>
        <div class="fit"></div>
        <div class="col"></div>
        <div class="col"></div>
      </div>
    </div>
    <div class="tools">
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

import { expandView } from '@/modules/animations';

@Component
export default class Layout extends Vue {
  private map!: Array<{ view: HTMLElement }>;
  private wrapper!: HTMLElement;

  private mounted() {
    this.wrapper = this.$el.getElementsByClassName('wrapper')[0] as HTMLElement;
  }

  private expand(e: Event) {
    expandView(e.target as HTMLElement, this.wrapper, 0.3);
  }
}
</script>

<style lang="scss">
$margin: 1px;
$border: 4px solid;
$alpha: 1;

.root {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: $margin;
  border: $border rgba(white, $alpha);
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  margin: $margin;
  border: $border rgba(red, $alpha);
}
.main {
  flex: 1 1 0;
  display: flex;
  margin: $margin;
  border: $border rgba(black, $alpha);
  min-width: 0;
  min-height: 0;
}
.wrapper {
  position: relative;
  flex: 1 1 0;
  display: flex;
  margin: $margin;
  border: $border rgba(blue, $alpha);
  min-width: 0;
  min-height: 0;
}
.views {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  margin: $margin;
  border: $border rgba(white, $alpha);
  min-width: 0;
  min-height: 0;
}
.view-slot {
  flex: 1 1 0;
  display: flex;
  margin: $margin;
  border: $border rgba(blue, $alpha);
  overflow: hidden;
}
.view {
  position: relative;
  flex: 3 3 0;
  margin: $margin;
  border: $border rgba(red, $alpha);
  background-color: transparent;
  overflow: hidden;
  transition: border 2s, background-color 2s;  
}
.view.expanded {
  border: $border rgba(lime, $alpha);
  background-color: rgba(black, 0.5);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.tools {
  margin: $margin;
  border: $border rgba(red, $alpha);
  width: 250px;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
div::after {
  margin: 0 5px;
  color: white;
  font-size: 12px;
}
.item {
  width: 50px;
  height: 50px;
  margin: 5px;
  border-radius: 5px;
  background-color: rgba(black, 0.5);
  &::after {
    content: "50";
  }
}
.row {
  width: 900px;
  height: 50px;
  margin: 5px;
  border-radius: 5px;
  background-color: rgba(black, 0.5);
  &::after {
    content: "900";
  }
}
.col {
  width: 50px;
  height: 250px;
  margin: 5px;
  border-radius: 5px;
  background-color: rgba(black, 0.5);
  &::after {
    content: "250";
  }
}
.fit {
  height: 50px;
  margin: 5px;
  border-radius: 5px;
  background-color: rgba(black, 0.5);
  &::after {
    content: "fit";
  }
}
.spacer {
  flex: 1 1 0;
}
</style>
