import Vue, { VueConstructor } from 'vue';
import '@/style/main.scss';

import ControlsView from '@/views/controls-view.vue';
import ConvexView from '@/views/convex-view.vue';
import LoremView from '@/views/lorem-view.vue';
import MovableView from '@/views/movable-view.vue';
import SvgView from '@/views/svg-view.vue';

import UiAccordion from '@/ui/accordion.vue';
import UiButton from '@/ui/button.vue';
import UiDialog from '@/ui/dialog.vue';
import UiPopup from '@/ui/popup.vue';
import UiScroller from '@/ui/scroller.vue';
import UiSlider from '@/ui/slider.vue';
import UiSpinBox from '@/ui/spin-box.vue';
import UiSvgElement from '@/ui/svg-element.vue';
import UiSvgText from '@/ui/svg-text.vue';

import { Application } from '@/modules/application';

Vue.config.productionTip = false;

([
  ['controls-view', ControlsView],
  ['convex-view', ConvexView],
  ['lorem-view', LoremView],
  ['movable-view', MovableView],
  ['svg-view', SvgView],

  ['ui-accordion', UiAccordion],
  ['ui-button', UiButton],
  ['ui-dialog', UiDialog],
  ['ui-popup', UiPopup],
  ['ui-scroller', UiScroller],
  ['ui-slider', UiSlider],
  ['ui-spin-box', UiSpinBox],
  ['ui-svg-element', UiSvgElement],
  ['ui-svg-text', UiSvgText],
] as Array<[string, VueConstructor]>).forEach(([name, constructor]) => Vue.component(name, constructor));

new Application().run();
