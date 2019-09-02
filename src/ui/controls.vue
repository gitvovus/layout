<template>
<div :class="['c-root', dark !== undefined ? 'c-dark' : 'c-lite']">
  <div>
    <div><br>Radio (index): {{model.index}}</div>
    <ui-button
      :dark="dark"
      class="round"
      v-for="(item, i) in model.group" :key="i+100"
      v-model="model.index"
      :toggle="[i]"
    >{{`#${i}`}}</ui-button>
    <div><br>Radio (object): { name: {{model.selectedItem.name}}, value: {{model.selectedItem.value}} }</div>
    <ui-button
      :dark="dark"
      class="round"
      v-for="(item, i) in model.items" :key="i+200"
      v-model="model.selectedItem"
      :toggle="[model.items[i]]"
    >{{`#${i}`}}</ui-button>
    <div><br>Checkbox: [ <div class="c-item" v-for="(item, i) in model.group" :key="i+300">{{item}}&nbsp;</div> ]</div>
    <ui-button
      :dark="dark"
      class="round"
      v-for="(item, i) in model.group" :key="i+400"
      v-model="model.group[i]"
      toggle
    >{{`#${i}`}}</ui-button>
    <div><br>Push:</div>
    <ui-button
      :dark="dark"
      class="round outline"
      @click="model.ok"
    >Ok</ui-button>
    <ui-button
      :dark="dark"
      class="round outline"
      @click="model.cancel"
    >Cancel</ui-button>
  </div>
  <div>
    <div class="expand-header">
      <div>Expand/collapse:</div>
      <ui-button
        :dark="dark"
        class="round icon-wrapper" @click="model.expanded = !model.expanded">
        <div :class="['icon', model.expanded ? 'collapse' : 'expand']"></div>
      </ui-button>
    </div>
    <div :class="['expansible', { expanded: model.expanded }]">
      <lorem :p="2" :class="['expansible-content', dark !== undefined ? 'dark' : 'lite']"/>
    </div>
    <template v-for="i in 2">
      <div class="expand-header" :key="100+i">
        <div>Expand (radio) {{i-1}}:</div>
        <ui-button
          :dark="dark"
          class="round icon-wrapper" v-model="model.expandedGroup" :toggle="[i-1, undefined]">
          <div :class="['icon', model.expandedGroup === i-1 ? 'collapse' : 'expand']"></div>
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
.c-margin {
  margin: 5px;
}
.c-padding {
  padding: 8px 12px;
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
    mask-image: url('~@/assets/less.svg');
    transform: rotate(-90deg);
  }
  &.collapse {
    mask-image: url('~@/assets/less.svg');
    transform: rotate(90deg);
  }
}
.expand-header {
  display: flex;
  align-items: center;
}
.inline-block {
  display: inline-block;
}
</style>
