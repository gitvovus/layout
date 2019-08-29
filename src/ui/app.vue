<template>
<div class="app" :style="{ backgroundImage: `url(${bg})` }">
  <layout v-if="model.page === 1"/>
  <mockup v-if="model.page === 2" :model="model"/>
  <floating class="effect" :class="{ show: model.show }" :width="600" :height="700">
    <div class="w-panel">
      <div class="w-header">Header</div>
      <div class="w-content"><lorem/></div>
      <div class="w-footer">Footer</div>
    </div>
  </floating>
  <div class="app-bar">
    <div class="spacer" :collapsed="model.align === 1"></div>
    <div class="app-buttons">
      <btn-toggle no-focus tabindex="-1" class="btn-margin" v-model="model.align" :check="1" :uncheck="0"> &lt; </btn-toggle>
      <btn-toggle class="btn-margin" v-model="model.test" :check="true" :uncheck="false"> Test </btn-toggle>
      <btn-toggle class="btn-margin" v-model="model.show" :check="true" :uncheck="false"> Dialog </btn-toggle>
      <span class="separator"/>
      <div class="text">Page:</div>
      <btn-toggle class="btn-margin" v-for="i in 3" :key="i" v-model="model.page" :check="i-1"> {{i-1}} </btn-toggle>
      <span class="separator"/>
      <btn-toggle no-focus tabindex="-1" class="btn-margin" v-model="model.align" :check="2" :uncheck="0"> &gt; </btn-toggle>
    </div>
    <div class="spacer" :collapsed="model.align === 2"></div>
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
const lite: img.RGBA = [l, l, l, 0xff];
const dark: img.RGBA = [d, d, d, 0xff];

@Observer
@Component
export default class App extends Vue {
  @Prop() private model!: Application;
  private bg = img.fromImageData(img.generate(s * 2, s * 2, (x, y) => ((x - x % s) / s & 1) === ((y - y % s) / s & 1) ? lite : dark));

  private mounted() {
    this.model.mount(this.$el);
  }

  private beforeDestroy() {
    this.model.unmount();
  }
}
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.floating {
  visibility: hidden;
}

.show.floating {
  visibility: visible;
}

.effect .floating-panel {
  transform: scale(0.5);
  opacity: 0;
  transition: all 0.3s;
}

.show.effect .floating-panel {
  transform: scale(1);
  opacity: 1;
}

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
  align-content: stretch;
  border-radius: 5px 5px 0 0;
  background-color: #e0e0e0;
  box-shadow: 0 0 8px rgba(black, 0.5);
  pointer-events: auto;
}
.btn-margin {
  margin: 5px;
}
.separator {
  width: 1px;
  background-color: #c0c0c0;
  margin: 0 5px;
}
.text {
  margin: auto;
}
.spacer {
  flex: 1 1 0;
  transition: flex 0.2s ease;
}
.spacer[collapsed] {
  flex: 0 0 auto;
}
</style>