<template>
<div class="root">
  <div class="header">
    <btn-toggle dark class="m-margin" v-for="i in 6" :key="i" v-model="button" :check="i-1">{{i-1}}</btn-toggle>
    <btn-toggle dark class="m-margin" v-model="test" :check="true" :uncheck="false">Test</btn-toggle>
  </div>
  <div class="main">
    <div class="wrapper" id="views-wrapper">
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
              <ui-button no-focus tabindex="-1" style="{ margin: 0; padding: 0; }" @click="model.view2d.toggleExpanded()">
                <div class="icon fullscreen"></div>
              </ui-button>
            </div>
          </view-2d>
        </div>
        <div class="view-slot"><div class="view" @click="toggleExpanded"></div></div>
      </div>
      <div class="view-3d">
        <div class="row"></div>
        <div class="col"></div>
        <div class="fit"></div>
        <div class="col"></div>
        <div class="col"></div>
      </div>
      <div class="m-toggle-views">
        <btn-toggle dark no-focus v-model="model.views" :check="false" :uncheck="true">{{(model.views ? '&lt;' : '&gt;')}}</btn-toggle>
      </div>
    </div>
    <div class="tools">
      <div class="m-dark">
        <btn-toggle dark no-focus tabindex="-1" class="m-padding" v-for="i in 6" :key="i+100" v-model="model.dark" :check="i-1" >Dark #{{i-1}}</btn-toggle>
      </div>
      <div class="m-lite">
        <btn-toggle class="m-padding" v-for="i in 6" :key="i+200" v-model="model.lite" :check="i-1">Lite #{{i-1}}</btn-toggle>
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
@import '@/style/_vars.scss';

.icon {
  display: inline-block;
  vertical-align: middle;
  width: 16px;
  height: 16px;
  margin: 2px;
  background-color: white;
  mask-position: center;
  mask-repeat: no-repeat;
}

.fullscreen {
  mask-image: url('~@/assets/fullscreen.svg');
}

.m-dark {
  background-color: #404040;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.m-lite {
  background-color: #e0e0e0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.m-toggle-views {
  background-color: #404040;
  border-radius: 50vh;
  box-shadow: 0 0 5px rgba(black, 0.5);
  position: absolute;
  margin: 5px;
  left: 0;
  bottom: 0;
  z-index: 2;
}
.m-margin {
  margin: 0 5px;
}
.m-padding {
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
