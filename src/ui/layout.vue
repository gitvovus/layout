<template>
<div class="l-root">
  <div class="l-header">
    <div class="l-item"></div>
    <div class="l-item"></div>
    <div class="l-item"></div>
    <div class="l-spacer"></div>
    <div class="l-item"></div>
    <div class="l-item"></div>
  </div>
  <div class="l-main">
    <div class="l-views">
      <div class="l-view">
        <div class="l-long"></div>
        <div class="l-col"></div>
        <div class="l-col"></div>
        <div class="l-col"></div>
        <div class="l-col"></div>
      </div>
      <div class="l-view">
      </div>
    </div>
    <div class="l-tools">
      <div class="l-row"></div>
      <div class="l-col"></div>
      <div class="l-col"></div>
      <div class="l-col"></div>
      <div class="l-col"></div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Layout extends Vue {}
</script>

<style lang="scss">
$l-margin: 1px;
$l-border: 4px solid;
$l-alpha: 0.75;

.l-root {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: $l-margin;
  border: $l-border rgba(white, $l-alpha);
  display: flex;
  flex-direction: column;
}
.l-header {
  display: flex;
  margin: $l-margin;
  border: $l-border rgba(red, $l-alpha);
}
.l-main {
  flex: 1 1 0;
  display: flex;
  flex-direction: row;
  margin: $l-margin;
  border: $l-border rgba(black, $l-alpha);
  min-width: 0;
  min-height: 0;
}
.l-views {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  margin: $l-margin;
  border: $l-border rgba(white, $l-alpha);
  min-width: 0;
  min-height: 0;
}
@media (min-aspect-ratio: 4/3) {
  .l-views {
    flex-direction: row;
  }
}
.l-view {
  flex: 1 1 0;
  margin: $l-margin;
  border: $l-border rgba(red, $l-alpha);
  overflow: hidden;
}
.l-tools {
  margin: $l-margin;
  border: $l-border rgba(red, $l-alpha);
  min-width: 200px;
  max-width: 300px;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
div::after {
  margin: 0 5px;
  color: white;
  font-size: 12px;
}
.l-item {
  width: 50px;
  height: 50px;
  margin: 5px;
  border-radius: 5px;
  background-color: rgba(black, 0.5);
  &::after {
    content: "50";
  }
}
.l-row {
  width: 250px;
  height: 50px;
  margin: 5px;
  border-radius: 5px;
  background-color: rgba(black, 0.5);
  &::after {
    content: "250";
  }
}
.l-long {
  width: 1000px;
  height: 50px;
  margin: 5px;
  border-radius: 5px;
  background-color: rgba(black, 0.5);
  &::after {
    content: "1000";
  }
}
.l-col {
  width: 50px;
  height: 150px;
  margin: 5px;
  border-radius: 5px;
  background-color: rgba(black, 0.5);
  &::after {
    content: "150";
  }
}
.l-spacer {
  flex: 1 1 0;
}
</style>
