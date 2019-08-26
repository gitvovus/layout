<template>
<div class="m-root">
  <div class="m-header">
    <btn-toggle dark class="m-margin" v-for="i in 4" :key="i" v-model="button" :check="i-1">{{i-1}}</btn-toggle>
    <btn-toggle dark class="m-margin" v-model="test" :check="true" :uncheck="false">Test</btn-toggle>
  </div>
  <div class="m-main">
    <div class="m-views">
      <div class="m-view">
        <div class="m-3d"></div>
      </div>
      <div class="m-view">
        <div class="m-2d"></div>
      </div>
    </div>
    <div class="m-tools">
      <div class="m-dark">
        <btn-toggle dark no-focus tabindex="-1" class="m-padding" v-for="i in 4" :key="i+100" v-model="model.dark" :check="i-1" >Dark #{{i-1}}</btn-toggle>
      </div>
      <div class="m-lite">
        <btn-toggle class="m-padding" v-for="i in 4" :key="i+200" v-model="model.lite" :check="i-1">Lite #{{i-1}}</btn-toggle>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Application } from '@/modules/application';

@Observer
@Component
export default class Mockup extends Vue {
  @Prop() private model!: Application;
  private test = true;
  private button = 0;
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
  z-index: 10;
}
.m-main {
  flex: 1 1 0;
  display: flex;
  flex-direction: row;
  min-width: 0;
  min-height: 0;
}
.m-views {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
@media (min-aspect-ratio: 4/3) {
  .m-views {
    flex-direction: row;
  }
}
.m-view {
  flex: 1 1 0;
  overflow: hidden;
}
.m-2d {
  width: 100%;
  height: 100%;
  border: 2px solid white;
}
.m-3d {
  width: 100%;
  height: 100%;
  border: 2px solid red;
}
.m-tools {
  width: 300px;
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
.m-margin {
  margin: 5px;
}
.m-padding {
  margin: 5px;
  padding: 15px 20px;
}
</style>
