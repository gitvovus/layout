<template>
<div :class="['grid', ['a', 'b', 'c', 'd'][model.expandedViewIndex]]">
  <div class="header">
    <ui-button prop class="round dark" v-for="i in 4" :key="i" :toggle="[i-1]" v-model="model.expandedViewIndex">{{i-1}}</ui-button>
  </div>
  <div v-for="i in 4" :key="i+100" :class="['cell', ['a', 'b', 'c', 'd'][i-1], { expanded: model.expandedViewIndex === i-1 }]"></div>
</div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Grid as Model } from '@/modules/grid';

@Observer
@Component
export default class Grid extends Vue {
  @Prop() private model!: Model;
}
</script>

<style lang="scss">
@import '@/style/_vars.scss';

$expanded-view-span: 3fr;

.grid {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-areas:
    "h h h"
    "a v t"
    "b v t"
    "c v t"
    "d v t"
    ;
  grid-template-columns: 1fr $expanded-view-span $tools-width;
  grid-template-rows: auto 0 1fr 1fr 1fr;
  &.a {
    grid-template-rows: auto 0 1fr 1fr 1fr;
  }
  &.b {
    grid-template-rows: auto 1fr 0 1fr 1fr;
  }
  &.c {
    grid-template-rows: auto 1fr 1fr 0 1fr;
  }
  &.d {
    grid-template-rows: auto 1fr 1fr 1fr 0;
  }
}

.cell {
  &.a {
    @include frame(red);
    grid-area: a;
    &.expanded {
      grid-area: v;
    }
  }
  &.b {
    @include frame(green);
    grid-area: b;
    &.expanded {
      grid-area: v;
    }
  }
  &.c {
    @include frame(blue);
    grid-area: c;
    &.expanded {
      grid-area: v;
    }
  }
  &.d{
    @include frame(yellow);
    grid-area: d;
    &.expanded {
      grid-area: v;
    }
  }
}

.header {
  grid-area: h;
}
</style>
