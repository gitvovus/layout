<template>
<div class="app" :style="{ backgroundImage: `url(${bg})` }">
  <!-- pages -->
  <transition>
    <div class="controls-wrapper" v-if="model.page === 1">
      <controls class="light" :model="model.controls[0]"/>
      <controls class="dark" :model="model.controls[1]"/>
    </div>
  </transition>
  <transition>
    <svg-view v-if="model.page === 2" :model="model.svgView"/>
  </transition>
  <transition>
    <layout v-if="model.page === 3"/>
  </transition>
  <transition>
    <mockup v-if="model.page === 4" :model="model"/>
  </transition>
  <!-- simple dialog -->
  <ui-dialog :class="['effect', { show: model.showDialog }]" :width="600" :height="720">
    <div class="w-panel">
      <div class="w-header">Header</div>
      <div class="w-content"><lorem/></div>
      <div class="w-footer">Footer</div>
    </div>
  </ui-dialog>
  <!-- convex hull demo dialog -->
  <ui-dialog :class="['effect', { show: model.showConvex }]" :width="800" :height="500">
    <div class="w-panel">
      <div class="w-header">Convex Hull &amp; Offset</div>
      <div class="w-content convex-wrapper">
        <ui-element :model="model.convex.root"/>
        <div>
          <ui-slider v-model="model.convex.pointCount" :min=0 :max="model.convex.points.length" style="width: 150px"/>
        </div>
      </div>
      <div class="w-footer"></div>
    </div>
  </ui-dialog>
  <!-- pages selection -->
  <div class="app-bar light">
    <div class="spacer" :collapsed="model.align === -1"></div>
    <div class="app-buttons">
      <ui-button no-focus tabindex="-1" class="round pretty light" v-model="model.align" :toggle="[-1, 0]">&lt;</ui-button>
      <ui-button class="round pretty light" toggle v-model="model.showDialog">Dialog</ui-button>
      <ui-button class="round pretty light" toggle v-model="model.showConvex">Convex</ui-button>
      <span class="separator"/>
      <div class="text">Page:</div>
      <ui-button class="round pretty light" v-for="(dummy, i) in 5" :key="i" v-model="model.page" :toggle="[i]">{{i}}</ui-button>
      <span class="separator"/>
      <ui-button no-focus tabindex="-1" class="round pretty light" v-model="model.align" :toggle="[1, 0]">&gt;</ui-button>
    </div>
    <div class="spacer" :collapsed="model.align === 1"></div>
  </div>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import * as img from '@/lib/images';
import { Application } from '@/modules/application';

const s = 20;
const l = 0x88;
const d = 0x80;
const light: img.RGBA = [l, l, l, 0xff];
const dark: img.RGBA = [d, d, d, 0xff];

@Observer
@Component
export default class App extends Vue {
  @Prop() private model!: Application;
  private bg = img.fromImageData(img.generate(s * 2, s * 2, (x, y) => ((x - x % s) / s & 1) === ((y - y % s) / s & 1) ? light : dark));

  private mounted() {
    this.model.mount(this.$el);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.app-bar {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: $z-app;
}
.app-buttons {
  display: flex;
  align-items: center;
  border-radius: 5px 5px 0 0;
  background-color: #e0e0e0;
  box-shadow: 0 0 8px rgba(black, 0.5);
  pointer-events: auto;
}
.separator {
  width: 1px;
  height: 100%;
  background-color: #c0c0c0;
}
.text {
  margin: 0 0.5rem;
}
.controls-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
}
.convex-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.v-enter,
.v-leave-to {
  opacity: 0;
} 
.v-enter-active,
.v-leave-active {
  transition: opacity $page-transition;
}
</style>
