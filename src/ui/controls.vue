<template>
<div :class="['c-root', dark === '' ? 'c-dark' : 'c-lite']">
  <div>
    <div>Radio (index): {{model.index}}</div>
    <ui-button v-for="(item, i) in model.group" :key="i+100"
      :class="['round', tint]"
      :toggle="[i]"
      v-model="model.index"
    >{{`#${i}`}}</ui-button>
    <div><br>Radio (object): { name: {{model.selectedItem.name}}, value: {{model.selectedItem.value}} }</div>
    <ui-button v-for="(item, i) in model.items" :key="i+200"
      :class="['round pretty', tint]"
      :toggle="[model.items[i]]"
      v-model="model.selectedItem"
    >{{`#${i}`}}</ui-button>
    <div><br>Checkbox: [ <div class="c-item" v-for="(item, i) in model.group" :key="i+300">{{item}}&nbsp;</div> ]</div>
    <ui-button v-for="(item, i) in model.group" :key="i+300"
      :class="['round', tint]"
      toggle
      v-model="model.group[i]"
    >{{`#${i}`}}</ui-button>
    <div><br>Push:</div>
    <ui-button @click="model.unstyled()">Unstyled</ui-button>
    <ui-button :class="['round outline', tint]" @click="model.ok()">Ok</ui-button>
    <ui-button :class="['round outline', tint]" @click="model.cancel()">Cancel</ui-button>
    clicked: {{model.message}}
  </div>
  <div>
    <ui-button :class="['round', tint, { 'no-events': model.popup }]" toggle v-model="model.popup">Popup</ui-button>
    <div class="popup-anchor" v-if="dark !== undefined" tabindex="-1">
      <ui-popup :class="['popup-sample content', tint]" v-model="model.popup">
        <input type="text" v-model="model.text"/>
        <lorem :p="2"/>
      </ui-popup>
    </div>
  </div>
  <div>
    <div class="expand-header">
      <div>Expand/collapse:</div>
      <ui-button :class="['round outline icon-wrapper', tint]" @click="model.expanded = !model.expanded">
        <div :class="['icon icon-less', model.expanded ? 'collapse' : 'expand']"></div>
      </ui-button>
    </div>
    <ui-accordion :expanded="model.expanded">
      <lorem :p="2" :class="['content', tint]"/>
    </ui-accordion>
    <template v-for="(dummy, i) in 2">
      <div class="expand-header" :key="i">
        <div>Expand (radio) {{i}}:</div>
        <ui-button :class="['round outline icon-wrapper', tint]" :toggle="[i, undefined]" v-model="model.expandedGroup">
          <div :class="['icon icon-less', model.expandedGroup === i ? 'collapse' : 'expand']"></div>
        </ui-button>
      </div>
      <ui-accordion :expanded="model.expandedGroup === i" :key="200+i">
        <lorem :p="2" :class="['content', tint]"/>
      </ui-accordion>
    </template>
  </div>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Controls as Model } from '@/modules/controls';

@Observer
@Component
export default class Controls extends Vue {
  @Prop() private model!: Model;
  @Prop() private dark: '' | undefined;

  public get tint() {
    return this.dark === '' ? 'dark' : 'lite';
  }
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.c-root {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 20px;
  max-height: 100vh;
  overflow-y: auto;
}
.c-dark {
  background-color: $bg-dark;
  color: $text-lite;
}
.c-lite {
  background-color: $bg-lite;
  color: $text-dark;
}
.c-item {
  display: inline-block;
}

.popup-anchor {
  position: relative;
  width: 0;
  height: 0;
}
.popup-sample {
  width: 500px;
  max-height: 500px;
  overflow-y: auto;
}
.popup-input {
  margin: 10px;
}
.no-events {
  pointer-events: none;
}

.expand-header {
  display: flex;
  align-items: center;
}
.icon {
  &.expand {
    transform: rotate(-90deg);
  }
  &.collapse {
    transform: rotate(90deg);
  }
}
.content {
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  &.dark {
    background-color: rgba(black, 0.05);
    border-color: rgba(white, 0.1);
  }
  &.lite {
    background-color: rgba(white, 0.1);
    border-color: rgba(black, 0.1);
  }
}
</style>
