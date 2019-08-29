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
        <div class="view-wrapper">
          <div id="view-0" class="view on-top" @click="expandView">
            <div class="row"></div>
            <div class="col"></div>
            <div class="col"></div>
          </div>
        </div>
        <div class="view-wrapper"><div id="view-1" class="view" @click="expandView"></div></div>
        <div class="view-wrapper"><div id="view-2" class="view" @click="expandView"></div></div>
      </div>
      <div class="view">
        <div class="row"></div>
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
      </div>
    </div>
    <div class="tools">
      <div class="row"></div>
      <div class="col"></div>
      <div class="col"></div>
      <div class="col"></div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

function transitionStart(e: TransitionEvent) {
  // console.log((e.target as HTMLElement).id, 'transition start:', e);
}

function transitionEnd(e: TransitionEvent) {
  // console.log((e.target as HTMLElement).id, 'transition end:', e);
}

@Component
export default class Layout extends Vue {
  private map!: Array<{ view: HTMLElement }>;

  private mounted() {
    for (let i = 0; i < 3; ++i) {
      const view = document.getElementById(`view-${i}`) as HTMLElement;
      view.addEventListener('transitionstart', transitionStart);
      view.addEventListener('transitionend', transitionEnd);
    }
  }

  private expandView(e: Event) {
    const el = e.target as HTMLElement;

    let target: HTMLElement;
    if (el.classList.contains('expanded')) {
      // from wrapper to parent
      target = el.parentElement!;
    } else {
      // from parent to wrapper
      target = this.$el.getElementsByClassName('wrapper')[0] as HTMLElement;
    }

    const targetRect = target.getBoundingClientRect();

    const rect = el.parentElement!.getBoundingClientRect();
    if (!el.classList.contains(`expand-${el.id}`)) {
      const style = document.createElement('style');
      style.className = `expand-${el.id}`;
      style.innerText = `
        .expand-${el.id} {
          position: absolute;
          left: ${rect.left - targetRect.left}px;
          top: ${rect.top - targetRect.top}px;
          right: ${targetRect.left + targetRect.width - rect.left - rect.width}px;
          bottom: ${targetRect.top + targetRect.height - rect.top - rect.height}px;
        }
      `;
      style.setAttribute('type', 'text/css');
      document.head.appendChild(style);
      el.classList.add(style.className);
      el.classList.toggle('expanded');
    }
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
.view-wrapper {
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
  overflow: hidden;
}
.on-top {
  z-index: 1;
}
.expanded {
  position: absolute;
  border: $border rgba(lime, $alpha);
  background-color: rgba(green, 0.1);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  transition: all 1s;
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
.spacer {
  flex: 1 1 0;
}
</style>
