<template>
<div class="root">
  <div class="header dark">
    <ui-button class="pretty round m-menu" v-for="i in 6" :key="i" v-model="button" :toggle="[i-1]">{{i-1}}</ui-button>
    <ui-button class="pretty round m-menu" v-model="test" toggle>Test</ui-button>
  </div>
  <div class="main">
    <div class="wrapper dark">
      <div class="views" :class="{ hidden: !model.views }">
        <div class="view-slot">
          <div class="view" @click="toggleExpanded">
            <div class="row"></div>
            <div class="col"></div>
            <div class="fit"></div>
            <div class="col"></div>
          </div>
        </div>
        <div class="view-slot">
          <view-2d :model="model.view2d">
            <div class="anchor right bottom">
              <ui-button no-focus tabindex="-1" class="icon-wrapper" @click="model.view2d.toggleExpanded()">
                <div class="icon icon-expand"></div>
              </ui-button>
            </div>
          </view-2d>
        </div>
        <div class="view-slot">
          <div class="view" @click="toggleExpanded">
            <img src="@/assets/brightness.svg"/>
          </div>
        </div>
      </div>
      <div class="view-3d">
        <div class="row"></div>
        <div class="col"></div>
        <div class="fit"></div>
        <div class="col"></div>
        <div class="col"></div>
      </div>
      <div class="m-toggle-views">
        <ui-button no-focus tabindex="-1" class="round icon-wrapper" toggle v-model="model.views">
          <div :class="['icon icon-less', { rotated: !model.views }]"></div>
        </ui-button>
      </div>
    </div>
    <div class="tools">
      <div class="m-dark dark">
        <ui-button class="pretty round m-side" v-for="i in 6" :key="i+100" v-model="model.dark" :toggle="[i-1]">Dark #{{i-1}}</ui-button>
      </div>
      <div class="m-light light">
        <ui-button class="pretty round m-side" v-for="i in 6" :key="i+200" v-model="model.light" :toggle="[i-1]">Light #{{i-1}}</ui-button>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Application } from '@/modules/application';
import { toggleExpanded } from '@/modules/animations';

@Observer
@Component
export default class Mockup extends Vue {
  @Prop() private model!: Application;
  private test = true;
  private button = 0;
  private wrapper!: HTMLElement;

  private mounted() {
    this.wrapper = this.$el.getElementsByClassName('wrapper')[0] as HTMLElement;
  }

  private toggleExpanded(e: Event) {
    toggleExpanded(e.currentTarget as HTMLElement, this.wrapper, 0.3);
  }
}
</script>

<style lang="scss">
@import '@/style/_icons.scss';
@import '@/style/_vars.scss';

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

.m-dark {
  background-color: $bg-dark;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.m-light {
  background-color: $bg-light;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.m-toggle-views {
  background-color: $bg-dark;
  border-radius: 50vh;
  position: absolute;
  margin: 5px;
  left: 0;
  bottom: 0;
  z-index: 2;
}
.button.m-menu {
  margin: 0 5px;
}
.button.m-side {
  margin: 5px;
  padding: 15px 20px;
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
</style>
