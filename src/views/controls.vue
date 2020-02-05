<template>
<div :class="['controls-root', tint]">
  <div>
    <!-- buttons -->
    <div class="expand-header">
      Buttons:
      <ui-button :class="['round outline icon-wrapper', tint]" @click="model.buttons = !model.buttons">
        <div :class="['icon icon-less', tint, model.buttons ? 'collapse' : 'expand']"></div>
      </ui-button>
    </div>
    <ui-accordion :expanded="model.buttons">
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
        <div><br>Checkbox: [ <span v-for="(item, i) in model.group" :key="i+300">{{item}}&nbsp;</span> ]</div>
        <ui-button v-for="(item, i) in model.group" :key="i+300"
          :class="['round', tint]"
          toggle
          v-model="model.group[i]"
        >{{`#${i}`}}</ui-button>
        <div><br>Push: {{model.message}}</div>
        <ui-button @click="model.click('unstyled')">Unstyled</ui-button>
        <ui-button :class="['round outline', tint]" @click="model.click('ok')">Ok</ui-button>
        <ui-button :class="['round outline', tint]" @click="model.click('cancel')">Cancel</ui-button>
        <ui-button :class="['round outline', tint]" @click="model.click('disabled')" disabled>Disabled</ui-button>
        <ui-button :class="['round pretty outline', tint]" :toggle="[model.items[0]]" v-model="model.selectedItem" disabled>Disabled</ui-button>
      </div>
    </ui-accordion>
    <!-- popup -->
    <div>
      <ui-button :class="['round outline', tint, { 'no-events': model.popup }]" toggle v-model="model.popup">Popup</ui-button>
      <div class="popup-anchor" v-show="dark !== undefined">
        <ui-popup :class="['popup-sample content', tint]" v-model="model.popup">
          <p>
            Popup is persistent until it loses focus.
            If you want popup to be closed when some element inside is clicked,
            add 'action' class to this element, like it is done for these buttons:
          </p>
          <div>
            <ui-button :class="['action round outline', tint]" @click="model.click('ok')">Ok</ui-button>
            <ui-button :class="['action round outline', tint]" @click="model.click('cancel')">Cancel</ui-button>
          </div>
          <div :class="['h-separator', tint]"></div>
          <div class="expand-header">
            <input type="text" v-model="model.text"/>
            <ui-button
              v-for="(item, i) in model.paragraphs"
              :key="i"
              :class="['round', tint]"
              :toggle="[i]"
              v-model="model.selectedParagraphs"
            >{{model.paragraphs[i]}}</ui-button>
          </div>
          <lorem :p="model.paragraphs[model.selectedParagraphs]"/>
        </ui-popup>
      </div>
    </div>
    <!-- accordions -->
    <div class="expand-header">
      Expand:
      <ui-button :class="['round outline icon-wrapper', tint]" @click="model.expanded = !model.expanded">
        <div :class="['icon icon-less', tint, model.expanded ? 'collapse' : 'expand']"></div>
      </ui-button>
      paragraphs:
      <ui-button
        v-for="(item, i) in model.paragraphs"
        :key="i"
        :class="['round', tint]"
        :toggle="[i]"
        v-model="model.selectedParagraphs"
      >{{model.paragraphs[i]}}</ui-button>
    </div>
    <ui-accordion :expanded="model.expanded">
      <lorem :p="model.paragraphs[model.selectedParagraphs]" :class="['content', tint]"/>
    </ui-accordion>
    <template v-for="(dummy, i) in 2">
      <div class="expand-header" :key="i">
        <div>Expand (radio #{{i}}):</div>
        <ui-button :class="['round outline icon-wrapper', tint]" :toggle="[i, undefined]" v-model="model.expandedGroup">
          <div :class="['icon icon-less', tint, model.expandedGroup === i ? 'collapse' : 'expand']"></div>
        </ui-button>
      </div>
      <ui-accordion :expanded="model.expandedGroup === i" :key="i+100">
        <lorem :p="2" :class="['content', tint]"/>
      </ui-accordion>
    </template>
  </div>
  <div>
    <ui-scroller :min="model.sliderMin" :max="model.sliderMax" v-model="model.spinValue"/>
    <ui-slider :min="model.sliderMin" :max="model.sliderMax" v-model="model.spinValue"/>
    <ui-spin-box v-model="model.spinValue" :values="model.spinValues"/>
    {{model.spinValue}}
    <ui-button :class="['button round outline', tint]" @click="model.reset()">Reset</ui-button>
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
    return this.dark === '' ? 'dark' : 'light';
  }
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.controls-root {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  &.dark {
    background-color: $bg-dark;
    color: $text-dark;
  }
  &.light {
    background-color: $bg-light;
    color: $text-light;
  }
}

.popup-anchor {
  display: inline-block;
  position: relative;
  width: 0;
  height: 0;
}
.popup-sample {
  width: 50%;
}
.no-events {
  pointer-events: none;
}

.expand-header {
  display: flex;
  align-items: center;
}
.icon {
  &.dark {
    background-color: $text-dark;
  }
  &.light {
    background-color: $text-light;
  }
  &.expand {
    transform: rotate(-90deg);
  }
  &.collapse {
    transform: rotate(90deg);
  }
}

.h-separator {
  margin: 0.5rem 0;
  height: 1px;
  &.dark {
    background-color: rgba($text-dark, 0.25);
  }
  &.light {
    background-color: rgba($text-light, 0.25);
  }
}

.content {
  // margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  &.dark {
    background-color: rgba(black, 0.05);
    border-color: rgba(white, 0.1);
  }
  &.light {
    background-color: rgba(white, 0.1);
    border-color: rgba(black, 0.1);
  }
}
</style>
