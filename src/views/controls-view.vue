<template>
  <div class="controls-root">
    <div>
      <!-- buttons -->
      <div class="expand-header">
        Buttons:
        <ui-button class="round outline icon-wrapper" @click="model.buttons = !model.buttons">
          <div :class="['icon icon-less', model.buttons ? 'collapse' : 'expand']"></div>
        </ui-button>
      </div>
      <ui-accordion :expanded="model.buttons">
        <div>
          <input type="text" value="text" style="width: 100px" />
          <ui-button class="outline">focusable</ui-button>
          <ui-button class="outline" no-focus tabindex="-1">non-focusable</ui-button>
          <ui-button class="outline">focusable</ui-button>
        </div>
        <div>
          <div>Radio (index): {{ model.index }}</div>
          <ui-button v-for="(item, i) in model.group" :key="i + 100" class="round" :toggle="[i]" v-model="model.index">{{
            `#${i}`
          }}</ui-button>
          <div><br />Radio (object): { name: {{ model.selectedItem.name }}, value: {{ model.selectedItem.value }} }</div>
          <ui-button
            v-for="(item, i) in model.items"
            :key="i + 200"
            class="round pretty"
            :toggle="[model.items[i]]"
            v-model="model.selectedItem"
            >{{ `#${i}` }}</ui-button
          >
          <div>
            <br />Checkbox: [
            <span v-for="(item, i) in model.group" :key="i + 300">{{ item }}&nbsp;</span>
            ]
          </div>
          <ui-button v-for="(item, i) in model.group" :key="i + 400" class="round" toggle v-model="model.group[i]">{{
            `#${i}`
          }}</ui-button>
          <div><br />Push: {{ model.message }}</div>
          <ui-button @click="model.click('unstyled')">Unstyled</ui-button>
          <ui-button class="round outline" @click="model.click('ok')">Ok</ui-button>
          <ui-button class="round outline" @click="model.click('cancel')">Cancel</ui-button>
          <ui-button class="round outline" @click="model.click('disabled')" disabled>Disabled</ui-button>
          <ui-button class="round pretty outline" :toggle="[model.items[0]]" v-model="model.selectedItem" disabled
            >Disabled</ui-button
          >
        </div>
      </ui-accordion>
      <!-- popup -->
      <div>
        <ui-button class="round outline" :disabled="model.popup" toggle v-model="model.popup">Popup</ui-button>
        <div class="popup-anchor">
          <ui-popup class="popup-sample content" v-model="model.popup">
            <p>
              Popup is persistent until it loses focus. If you want popup to be closed when some element inside is clicked, add
              'action' class to this element, like it is done for these buttons:
            </p>
            <div>
              <ui-button class="action round outline" @click="model.click('ok')">Ok</ui-button>
              <ui-button class="action round outline" @click="model.click('cancel')">Cancel</ui-button>
            </div>
            <div class="h-separator"></div>
            <div class="expand-header">
              <input type="text" v-model="model.text" />
              <ui-button
                v-for="(item, i) in model.paragraphs"
                :key="i"
                class="round"
                :toggle="[item]"
                v-model="model.lorem.paragraphs"
                >{{ item }}</ui-button
              >
            </div>
            <lorem-view :model="model.lorem" />
          </ui-popup>
        </div>
      </div>
      <!-- accordions -->
      <div class="expand-header">
        Expand:
        <ui-button class="round outline icon-wrapper" @click="model.expanded = !model.expanded">
          <div :class="['icon icon-less', model.expanded ? 'collapse' : 'expand']"></div>
        </ui-button>
        paragraphs:
        <ui-button
          v-for="(item, i) in model.paragraphs"
          :key="i"
          class="round"
          :toggle="[item]"
          v-model="model.lorem.paragraphs"
          >{{ item }}</ui-button
        >
      </div>
      <ui-accordion :expanded="model.expanded">
        <lorem-view :model="model.lorem" class="content" />
      </ui-accordion>
      <template v-for="(dummy, i) in 2">
        <div class="expand-header" :key="i">
          <div>Expand (radio #{{ i }}):</div>
          <ui-button class="round outline icon-wrapper" :toggle="[i, undefined]" v-model="model.expandedGroup">
            <div :class="['icon icon-less', model.expandedGroup === i ? 'collapse' : 'expand']"></div>
          </ui-button>
        </div>
        <ui-accordion :expanded="model.expandedGroup === i" :key="i + 500">
          <lorem-view :model="model.lorem" class="content" />
        </ui-accordion>
      </template>
    </div>
    <p>
      <ui-scroller :min="model.sliderMin" :max="model.sliderMax" v-model="model.spinValue" style="height: 100px" />
      <ui-slider :min="model.sliderMin" :max="model.sliderMax" v-model="model.spinValue" style="width: 100px" />
      <ui-spin-box v-model="model.spinValue" :values="model.spinValues" />
      <input type="number" min="10" max="50" step="10" v-model="model.spinValue" style="width: 50px; height: 24px" />
      {{ model.spinValue }}
      <ui-button class="round outline" @click="model.reset()">Reset</ui-button>
    </p>
    <div class="list">
      <div class="list-item" v-for="(item, i) in model.list" :key="i + 600">
        <div class="list-icon icon-brightness"></div>
        <div class="list-left">
          <div>{{ item.name }}</div>
          <div class="list-right">
            <div class="list-slider">
              <ui-slider :min="0" :max="10" v-model="item.value" />
            </div>
            <div>
              <div class="list-icon icon-contrast"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tip-container">
      <svg class="tip-top" xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12">
        <path class="tip-top-fill" d="M0 12L8 0L16 12z" />
        <path class="tip-top-stroke" d="M0 12L8 0L16 12" fill="none" />
      </svg>
      <div class="tip-body">
        <ui-button>Popup button #1</ui-button>
        <ui-button>Popup button #2</ui-button>
        <ui-button>Popup button #3</ui-button>
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
export default class ControlsView extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

.tip-container {
  margin-right: auto;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0 0 10px black);
}
.tip-top {
  margin-left: 20px;
  padding: 0;
  transform: translateY(1px);
}
.tip-body {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  .button {
    margin: 0;
  }
}
.dark {
  & .tip-body {
    background-color: #404040;
    border: 1px solid lime;
  }
  & .tip-top-fill {
    fill: #404040;
  }
  & .tip-top-stroke {
    stroke: lime;
  }
}
.light {
  & .tip-body {
    background-color: ivory;
    border: 1px solid red;
  }
  & .tip-top-fill {
    fill: ivory;
  }
  & .tip-top-stroke {
    stroke: red;
  }
}

$w: 200px;
$i: 26px;
$m: 10px;
$t: 0.3s;
.list {
  color: black;
}
.list-item {
  width: $w;
  background-color: white;
  margin: 1px;
  display: flex;
}
.list-icon {
  width: 18px;
  height: 18px;
  margin: 4px;
  vertical-align: middle;
  mask-position: center;
  mask-repeat: no-repeat;
  background-color: black;
}
.list-left {
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
}
.list-right {
  background-color: white;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: $i;
  transition: width $t;
  overflow: hidden;
  &:hover {
    width: 100%;
  }
  &:hover .list-slider {
    flex: 1 0 ($w - 2 * $i);
  }
}
.list-slider {
  flex: 1 0 0;
  transition: flex 1s;
  overflow: hidden;
}
.list-slider .slider {
  width: $w - 2 * $i - 2 * $m;
  margin: 0 $m;
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
.expand-header {
  display: flex;
  align-items: center;
}

.controls-root {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 20px;
  overflow-x: hidden;
  overflow-y: auto;
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
  padding: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
}

.dark {
  &.controls-root {
    background-color: $bg-dark;
    color: $text-dark;
  }
  & .icon {
    background-color: $text-dark;
  }
  & .content-root {
    background-color: $bg-dark;
  }
  & .content {
    background-color: rgba(black, 0.05);
    border-color: rgba(white, 0.1);
  }
}

.light {
  &.controls-root {
    background-color: $bg-light;
    color: $text-light;
  }
  & .icon {
    background-color: $text-light;
  }
  & .content-root {
    background-color: $bg-light;
  }
  & .content {
    background-color: rgba(white, 0.1);
    border-color: rgba(black, 0.1);
  }
}
</style>
