import Vue, { VueConstructor } from 'vue';
import '@/style/main.scss';

import ControlsView from '@/views/controls-view.vue';
import ConvexDemo from '@/views/convex-demo.vue';
import EventTracker from '@/views/event-tracker.vue';
import IconTool from '@/views/icon-tool.vue';
import LoremView from '@/views/lorem-view.vue';
import MovableDemo from '@/views/movable-demo.vue';
import MovableView from '@/views/movable-view.vue';
import SceneDemo from '@/views/scene-demo.vue';
import SvgDemo from '@/views/svg-demo.vue';
import SvgTool from '@/views/svg-tool.vue';

import UiAccordion from '@/ui/accordion.vue';
import UiButton from '@/ui/button.vue';
import UiDialog from '@/ui/dialog.vue';
import UiPopup from '@/ui/popup.vue';
import UiResizer from '@/ui/resizer.vue';
import UiScroller from '@/ui/scroller.vue';
import UiSlider from '@/ui/slider.vue';
import UiSpinBox from '@/ui/spin-box.vue';
import UiSvgElement from '@/ui/svg-element.vue';
import UiSvgText from '@/ui/svg-text.vue';

import { Application } from '@/modules/application';

Vue.config.productionTip = false;

([
  ['controls-view', ControlsView],
  ['convex-demo', ConvexDemo],
  ['event-tracker', EventTracker],
  ['icon-tool', IconTool],
  ['lorem-view', LoremView],
  ['movable-demo', MovableDemo],
  ['movable-view', MovableView],
  ['scene-demo', SceneDemo],
  ['svg-demo', SvgDemo],
  ['svg-tool', SvgTool],

  ['ui-accordion', UiAccordion],
  ['ui-button', UiButton],
  ['ui-dialog', UiDialog],
  ['ui-popup', UiPopup],
  ['ui-resizer', UiResizer],
  ['ui-scroller', UiScroller],
  ['ui-slider', UiSlider],
  ['ui-spin-box', UiSpinBox],
  ['ui-svg-element', UiSvgElement],
  ['ui-svg-text', UiSvgText],
] as [string, VueConstructor][]).forEach(([name, constructor]) => Vue.component(name, constructor));

new Application().run();
