<template>
<div :class="['c-root', dark === '' ? 'c-dark' : 'c-lite']">
  <div>
    <div><br>Radio (index): {{model.index}}</div>
    <ui-button
      :class="['round', tint]"
      v-for="(item, i) in model.group" :key="i+100"
      v-model="model.index"
      :toggle="[i]"
    >{{`#${i}`}}</ui-button>
    <div><br>Radio (object): { name: {{model.selectedItem.name}}, value: {{model.selectedItem.value}} }</div>
    <ui-button
      :class="['round', tint]"
      v-for="(item, i) in model.items" :key="i+200"
      v-model="model.selectedItem"
      :toggle="[model.items[i]]"
    >{{`#${i}`}}</ui-button>
    <div><br>Checkbox: [ <div class="c-item" v-for="(item, i) in model.group" :key="i+300">{{item}}&nbsp;</div> ]</div>
    <ui-button
      :class="['round', tint]"
      v-for="(item, i) in model.group" :key="i+400"
      v-model="model.group[i]"
      toggle
    >{{`#${i}`}}</ui-button>
    <div><br>Push:</div>
    <ui-button @click="model.unstyled()">Unstyled</ui-button>
    <ui-button
      :class="['round outline', tint]"
      @click="model.ok()"
    >Ok</ui-button>
    <ui-button
      :class="['round outline', tint]"
      @click="model.cancel()"
    >Cancel</ui-button>
    clicked: {{model.message}}
  </div>
  <div>
    <div class="expand-header">
      <div>Expand/collapse:</div>
      <ui-button
        :class="['round outline icon-wrapper', tint]" @click="model.expanded = !model.expanded">
        <div :class="['icon icon-less', model.expanded ? 'collapse' : 'expand']"></div>
      </ui-button>
    </div>
    <div :class="['expansible', { expanded: model.expanded }]">
      <lorem :p="2" :class="['expansible-content', dark !== undefined ? 'dark' : 'lite']"/>
    </div>
    <template v-for="i in 2">
      <div class="expand-header" :key="i">
        <div>Expand (radio) {{i-1}}:</div>
        <ui-button
          :class="['round outline icon-wrapper', tint]" v-model="model.expandedGroup" :toggle="[i-1, undefined]">
          <div :class="['icon icon-less', model.expandedGroup === i-1 ? 'collapse' : 'expand']"></div>
        </ui-button>
      </div>
      <div :class="['expansible', { expanded: model.expandedGroup === i-1 }]" :key="200+i">
        <lorem :p="2" :class="['expansible-content', dark !== undefined ? 'dark' : 'lite']"/>
      </div>
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
  padding-left: 50px;
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
.expansible {
  margin: 0 5px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s;
  &.expanded {
    max-height: 100%;
  }
}
.expansible-content {
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  &.dark {
    border-color: rgba(white, 0.1);
  }
  &.lite {
    border-color: rgba(black, 0.1);
  }
}

.icon {
  &.expand {
    transform: rotate(-90deg);
  }
  &.collapse {
    transform: rotate(90deg);
  }
}
.expand-header {
  display: flex;
  align-items: center;
}
</style>
