<template>
<div class="m-root">
  <div class="m-header">
    <btn-toggle dark class="m-margin" v-for="i in 6" :key="i" v-model="button" :check="i-1">{{i-1}}</btn-toggle>
    <btn-toggle dark class="m-margin" v-model="test" :check="true" :uncheck="false">Test</btn-toggle>
  </div>
  <div class="m-main">
    <div class="m-wrapper">
      <div class="m-views" :class="{ hidden: !model.views }">
        <div class="m-view-slot">
          <div class="m-view" @click="toggleExpanded">
            <div class="row"></div>
            <div class="col"></div>
            <div class="fit"></div>
            <div class="col"></div>
          </div>
        </div>
        <div class="m-view-slot"><div class="m-view" @click="toggleExpanded"></div></div>
        <div class="m-view-slot"><div class="m-view" @click="toggleExpanded"></div></div>
      </div>
      <div class="m-view-3d">
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
    <div class="m-tools">
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
    this.wrapper = this.$el.getElementsByClassName('m-wrapper')[0] as HTMLElement;
  }

  private toggleExpanded(e: Event) {
    toggleExpanded(e.currentTarget as HTMLElement, this.wrapper, 0.3);
  }
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.m-root {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}
.m-header {
  display: flex;
  padding: 5px;
  background-color: #404040;
  box-shadow: $menu-shadow;
  color: white;
  font-size: 16px;
  z-index: $z-app;
}
.m-main {
  flex: 1 1 0;
  display: flex;
  min-width: 0;
  min-height: 0;
}
.m-wrapper {
  position: relative;
  flex: 1 1 0;
  display: flex;
  min-width: 0;
  min-height: 0;
}
.m-views {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  transition: flex 0.3s;
}
.m-views.hidden {
  flex: 0 0 0;
}
.m-view-slot {
  flex: 1 1 0;
  display: flex;
  overflow: hidden;
}
.m-view {
  position: relative;
  flex: 1 1 0;
  overflow: hidden;
  background-color: rgba(black, 0.5);
}
.m-view.expanded {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.m-view-3d {
  position: relative;
  flex: 3 3 0;
  overflow: hidden;
}
.m-tools {
  width: 250px;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: silver;
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
  margin: 5px;
}
.m-padding {
  margin: 5px;
  padding: 15px 20px;
}
</style>
