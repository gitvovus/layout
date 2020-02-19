import Vue, { VueConstructor } from 'vue';
import '@/style/main.scss';

import Controls from '@/views/controls.vue';
import Layout from '@/views/layout.vue';
import Lorem from '@/views/lorem.vue';
import Mockup from '@/views/mockup.vue';
import SvgView from '@/views/svg-view.vue';
import View2d from '@/views/view-2d.vue';

import UiAccordion from '@/ui/accordion.vue';
import UiButton from '@/ui/button.vue';
import UiDialog from '@/ui/dialog.vue';
import UiElement from '@/ui/element.vue';
import UiPopup from '@/ui/popup.vue';
import UiScroller from '@/ui/scroller.vue';
import UiSlider from '@/ui/slider.vue';
import UiSpinBox from '@/ui/spin-box.vue';
import UiText from '@/ui/text.vue';

import { Application } from '@/modules/application';

Vue.config.productionTip = false;

([
  ['controls', Controls],
  ['layout', Layout],
  ['lorem', Lorem],
  ['mockup', Mockup],
  ['svg-view', SvgView],
  ['view-2d', View2d],

  ['ui-accordion', UiAccordion],
  ['ui-button', UiButton],
  ['ui-dialog', UiDialog],
  ['ui-element', UiElement],
  ['ui-popup', UiPopup],
  ['ui-scroller', UiScroller],
  ['ui-slider', UiSlider],
  ['ui-spin-box', UiSpinBox],
  ['ui-text', UiText],
] as Array<[string, VueConstructor]>).forEach(([name, constructor]) => Vue.component(name, constructor));

new Application().run();
