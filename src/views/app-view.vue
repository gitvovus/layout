<template>
  <div class="app" :style="{ backgroundImage: `url(${bg})` }">
    <!-- pages -->
    <transition>
      <div class="controls-wrapper" v-if="model.page === 1">
        <controls-view class="light" :model="model.controls[0]" />
        <controls-view class="dark" :model="model.controls[1]" />
      </div>
      <svg-view v-if="model.page === 2" :model="model.svgView" />
      <div class="app dark" v-if="model.page === 3">
        <movable-view v-for="(item, i) in model.movable" :key="i" :model="item">
          <div class="anchor right bottom" v-if="i !== model.expanded">
            <ui-button no-focus tabindex="-1" class="icon-wrapper" @click="model.expand(i)">
              <div class="icon icon-expand"></div>
            </ui-button>
          </div>
        </movable-view>
      </div>
    </transition>
    <!-- simple dialog -->
    <ui-dialog :class="['effect', { show: model.dialog === 1 }]" :width="600" :height="720">
      <div class="w-panel">
        <div class="w-header">Header</div>
        <div class="w-content"><lorem-view /></div>
        <div class="w-footer">Footer</div>
      </div>
    </ui-dialog>
    <!-- convex hull demo dialog -->
    <convex-view :class="{ show: model.dialog === 2 }" :width="800" :height="500" :model="model.convex" />
    <!-- pages selection -->
    <div class="app-bar light">
      <div class="spacer" :collapsed="model.align === -1"></div>
      <div class="app-buttons">
        <ui-button no-focus tabindex="-1" class="round pretty" v-model="model.align" :toggle="[-1, 0]">&lt;</ui-button>
        <ui-button class="round pretty" :toggle="[1, 0]" v-model="model.dialog">Dialog</ui-button>
        <ui-button class="round pretty" :toggle="[2, 0]" v-model="model.dialog">Convex</ui-button>
        <span class="v-separator" />
        <div class="text">Page:</div>
        <ui-button class="round pretty" v-for="(dummy, i) in 4" :key="i" v-model="model.page" :toggle="[i]">{{ i }}</ui-button>
        <span class="v-separator" />
        <ui-button no-focus tabindex="-1" class="round pretty" v-model="model.align" :toggle="[1, 0]">&gt;</ui-button>
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
import { Application as Model } from '@/modules/application';

const s = 20;
const l = 0x88;
const d = 0x80;
const light: img.RGBA = [l, l, l, 0xff];
const dark: img.RGBA = [d, d, d, 0xff];

@Observer
@Component
export default class AppView extends Vue {
  @Prop() private model!: Model;
  private bg = img.fromImageData(
    img.generate(s * 2, s * 2, (x, y) => ((((x - (x % s)) / s) & 1) === (((y - (y % s)) / s) & 1) ? light : dark)),
  );
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.app-bar {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  pointer-events: none;
  z-index: $z-app;
}
.app-buttons {
  display: flex;
  align-items: baseline;
  border-radius: 5px 5px 0 0;
  box-shadow: 0 0 8px rgba(black, 0.5);
  pointer-events: auto;
  & .v-separator {
    align-self: stretch;
  }
}
.dark .app-buttons {
  background-color: $bg-dark;
  color: $text-dark;
}
.light .app-buttons {
  background-color: $bg-light;
  color: $text-light;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dark .button.icon-wrapper,
.light .button.icon-wrapper {
  width: 24px;
  height: 24px;
  margin: 2px;
  padding: 3px;
  &:hover {
    padding: 1px;
  }
  &:hover:active {
    padding: 2px;
  }
}

.icon {
  width: 100%;
  height: 100%;
  vertical-align: middle;
  mask-position: center;
  mask-repeat: no-repeat;
  transform: rotate(0);
  transition: transform $transition;
}
.icon.rotated {
  transform: rotate(180deg);
}

.anchor {
  position: absolute;
}
.right {
  right: 0;
}
.bottom {
  bottom: 0;
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
