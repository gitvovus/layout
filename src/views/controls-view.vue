<template>
  <div class="controls-view">
    <div>
      <!-- buttons -->
      <div class="expand-header">
        Buttons:
        <ui-button class="round outline iconic" @click="model.buttons = !model.buttons">
          <div :class="['icon icon-lt', model.buttons ? 'collapse' : 'expand']"></div>
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
        <ui-button class="round outline iconic" @click="model.expanded = !model.expanded">
          <div :class="['icon icon-lt', model.expanded ? 'collapse' : 'expand']"></div>
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
          <ui-button class="round outline iconic" :toggle="[i, undefined]" v-model="model.expandedGroup">
            <div :class="['icon icon-lt', model.expandedGroup === i ? 'collapse' : 'expand']"></div>
          </ui-button>
        </div>
        <ui-accordion :expanded="model.expandedGroup === i" :key="i + 500">
          <lorem-view :paragraphs="1" class="content" />
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
    <!-- sliding menu -->
    <div><br /></div>
    <div class="menu">
      <div class="sub-menu-item">
        <ui-button no-focus tabindex="-1">Descriptions</ui-button>
        <div class="popup-container">
          <div class="popup-content">
            <ui-button no-focus tabindex="-1">Description #1</ui-button>
            <ui-button no-focus tabindex="-1">Description #2</ui-button>
          </div>
        </div>
      </div>
      <ui-button no-focus tabindex="-1">Item</ui-button>
      <div class="sub-menu-item">
        <ui-button no-focus tabindex="-1">Options</ui-button>
        <div class="popup-container">
          <div class="popup-content">
            <ui-button no-focus tabindex="-1">Option #1</ui-button>
            <ui-button no-focus tabindex="-1">Option #2</ui-button>
          </div>
        </div>
      </div>
      <div class="sub-menu-item">
        <ui-button no-focus tabindex="-1">Tip top</ui-button>
        <div class="popup-container">
          <div class="tip-container">
            <svg class="tip-top" width="16" height="12" viewBox="0 0 16 12">
              <path class="tip-top-fill" d="M0 12L8 0L16 12z" />
              <path class="tip-top-stroke" d="M0 12L8 0L16 12" fill="none" />
            </svg>
            <div class="tip-body">
              <ui-button no-focus tabindex="-1">Popup button #1</ui-button>
              <ui-button no-focus tabindex="-1">Popup button #2</ui-button>
              <ui-button no-focus tabindex="-1">Popup button #3</ui-button>
            </div>
          </div>
        </div>
      </div>
      <ui-resizer class="sub-menu-item">
        <template v-slot:header>
          <ui-button no-focus tabindex="-1">Resizer header</ui-button>
        </template>
        <template v-slot:content>
          <div class="popup-container">
            <div class="popup-content">
              <lorem-view class="resizer-content" :paragraphs="1" />
            </div>
          </div>
        </template>
      </ui-resizer>
    </div>
    <div class="scrollable">
      <lorem-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ControlsView as Model } from '@/modules/controls-view';

@Observer
@Component
export default class ControlsView extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

$indent-v: 5px;
$indent-h: 10px;
.tip-container {
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
  border-radius: $r;
  background-color: $bg-dark;
  border: 1px solid orange;
  .button {
    margin: 0;
    padding: $indent-v $indent-h;
  }
}
.tip-top-fill {
  fill: $bg-dark;
}
.tip-top-stroke {
  stroke: orange;
}

.menu {
  display: flex;
  box-shadow: $popup-shadow;
  background-color: $bg-dark;
  & .button {
    margin: 0;
    padding: $indent-v $indent-h;
  }
}
.menu-item,
.sub-menu-item {
  white-space: nowrap;
  user-select: none;
  &:hover {
    & .popup-container {
      height: auto;
      overflow: visible;
    }
  }
}
.sub-menu-item {
  position: relative;
  display: flex;
  flex-direction: column;
}
.popup-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  left: -($indent-h);
  top: 100%;
  height: 0;
  overflow: hidden;
}
.popup-content {
  display: flex;
  flex-direction: column;
  background-color: $bg-dark;
  margin: 5px 8px 8px 8px;
  box-shadow: $popup-shadow;
}
.resizer-content {
  width: 200px;
  white-space: normal;
  padding: 0 $indent-h;
  user-select: text;
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

.controls-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
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
  border-radius: $r;
  border: 1px solid rgba(white, 0.1);
}

.scrollable {
  margin-top: 1em;
  padding: 0 1em;
  border-style: solid;
  border-color: orange;
  border-width: 1px 0;
  max-width: 50%;
  max-height: 200px;
  overflow-y: scroll;
}
</style>
