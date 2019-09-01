<template>
<div class="c-root">
  <div class="c-panel c-dark">
    <div>
      <div><br>Radio (index): {{model.index}}</div>
      <ui-button
        dark
        class="round"
        v-for="(item, i) in model.group" :key="i+100"
        v-model="model.index"
        :toggle="[i]"
      >{{`#${i}`}}</ui-button>
      <div><br>Radio (object): { name: {{model.selectedItem.name}}, value: {{model.selectedItem.value}} }</div>
      <ui-button
        dark
        class="round"
        v-for="(item, i) in model.items" :key="i+200"
        v-model="model.selectedItem"
        :toggle="[model.items[i]]"
      >{{`#${i}`}}</ui-button>
      <div><br>Checkbox: [ <div class="c-item" v-for="(item, i) in model.group" :key="i+300">{{item}}&nbsp;</div> ]</div>
      <ui-button
        dark
        class="round"
        v-for="(item, i) in model.group" :key="i+400"
        v-model="model.group[i]"
        toggle
      >{{`#${i}`}}</ui-button>
      <div><br>Push:</div>
      <ui-button
        dark
        class="round outline"
        @click="model.ok"
      >Ok</ui-button>
      <ui-button
        dark
        class="round outline"
        @click="model.cancel"
      >Cancel</ui-button>
    </div>
  </div>
  <div class="c-panel c-lite">
    <div>
      <div><br>Radio (index): {{model.index}}</div>
      <ui-button
        class="round"
        v-for="(item, i) in model.group" :key="i+100"
        v-model="model.index"
        :toggle="[i]"
      >{{`#${i}`}}</ui-button>
      <div><br>Radio (object): { name: {{model.selectedItem.name}}, value: {{model.selectedItem.value}} }</div>
      <ui-button
        class="round"
        v-for="(item, i) in model.items" :key="i+200"
        v-model="model.selectedItem"
        :toggle="[model.items[i]]"
      >{{`#${i}`}}</ui-button>
      <div><br>Checkbox: [ <div class="c-item" v-for="(item, i) in model.group" :key="i+300">{{item}}&nbsp;</div> ]</div>
      <ui-button
        class="round"
        v-for="(item, i) in model.group" :key="i+400"
        v-model="model.group[i]"
        :toggle="[true, false]"
      >{{`#${i}`}}</ui-button>
      <div><br>Push:</div>
      <ui-button
        class="round outline"
        @click="model.ok"
      >Ok</ui-button>
      <ui-button
        class="round outline"
        @click="model.cancel"
      >Cancel</ui-button>
    </div>
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
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.c-root {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
}
.c-panel {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 150px;
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
</style>
