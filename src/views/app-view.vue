<template>
  <div class="app" :style="{ backgroundImage: `url(${bg})` }">
    <!-- pages -->
    <transition>
      <component v-if="model.activePage !== undefined" :is="model.activePage.template" :model="model.activePage" />
    </transition>
    <!-- simple dialog -->
    <ui-dialog :class="['effect', { show: model.dialog === 0 }]" :width="600" :height="720">
      <div class="w-panel">
        <div class="w-header">Header</div>
        <div class="w-content"><lorem-view /></div>
        <div class="w-footer">Footer</div>
      </div>
    </ui-dialog>
    <!-- convex hull demo dialog -->
    <convex-demo-view :class="{ show: model.dialog === 1 }" :width="800" :height="500" :model="model.convex" />
    <!-- pages selection -->
    <div class="app-bar">
      <div :class="['spacer', { collapsed: model.align === -1 }]"></div>
      <div class="app-buttons">
        <ui-button no-focus tabindex="-1" class="round iconic" v-model="model.align" :toggle="[-1, 0]">
          <div class="icon icon-lt"></div>
        </ui-button>
        <ui-button class="round pretty" :toggle="[0, undefined]" v-model="model.dialog">Dialog</ui-button>
        <ui-button class="round pretty" :toggle="[1, undefined]" v-model="model.dialog">Convex</ui-button>
        <span class="v-separator" />
        <div class="text">Page:</div>
        <ui-button class="round pretty" v-for="(dummy, i) in model.pages" :key="i" v-model="model.page" :toggle="[i]">{{
          i
        }}</ui-button>
        <span class="v-separator" />
        <ui-button no-focus tabindex="-1" class="round iconic" v-model="model.align" :toggle="[1, 0]">
          <div class="icon icon-gt"></div>
        </ui-button>
      </div>
      <div :class="['spacer', { collapsed: model.align === 1 }]"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import * as img from '@/lib/images';
import * as svg from '@/lib/svg';
import { Application as Model } from '@/modules/application';

const s = 20;
const l = 0x90;
const d = 0x80;
const lite: img.RGBA = [l, l, l, 0xff];
const dark: img.RGBA = [d, d, d, 0xff];

@Observer
@Component
export default class AppView extends Vue {
  @Prop() private model!: Model;
  private bg = img.fromImageData(
    img.generate(s * 2, s * 2, (x, y) => ((((x - (x % s)) / s) & 1) === (((y - (y % s)) / s) & 1) ? lite : dark)),
  );
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.app {
  & .svg-demo-view {
    margin: 10vh 10vw;
    background-color: rgba(#ffffe0, 3/4);
    border-radius: 8px;
    box-shadow: $w-shadow;
  }
  & .movable .svg-demo-view {
    margin: 20px;
  }
  & .event-tracker-view {
    margin: 10vh 10vw;
    border: 1px solid orange;
    border-radius: 8px;
    background-color: rgba(black, 1/4);
    box-shadow: $w-shadow;
  }
}
.app-bar {
  position: absolute;
  width: 100%;
  top: 0;
  display: flex;
  pointer-events: none;
  z-index: $z-app;
}
.app-buttons {
  display: flex;
  align-items: center;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 0 8px rgba(black, 1/2);
  pointer-events: auto;
  background-color: $bg-dark;
  color: $text-dark;
  padding: 0 3px;
  & .v-separator {
    align-self: stretch;
  }
  & .text {
    margin: 0 0.5em;
    padding-bottom: 2px;
  }
  & .button.iconic {
    margin: 0 5px;
  }
}

.convex-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.button.iconic {
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
