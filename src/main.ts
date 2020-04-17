import Vue, { VueConstructor } from 'vue';
import '@/style/main.scss';

import ControlsView from '@/views/controls-view.vue';
import ConvexDemoView from '@/views/convex-demo-view.vue';
import EventTrackerView from '@/views/event-tracker-view.vue';
import IconTool from '@/views/icon-tool.vue';
import LoremView from '@/views/lorem-view.vue';
import MovableDemoView from '@/views/movable-demo-view.vue';
import MovableView from '@/views/movable-view.vue';
import SceneDemoView from '@/views/scene-demo-view.vue';
import SvgDemoView from '@/views/svg-demo-view.vue';
import SvgDrawingView from '@/views/svg-drawing-view.vue';

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
  ['convex-demo-view', ConvexDemoView],
  ['event-tracker-view', EventTrackerView],
  ['icon-tool', IconTool],
  ['lorem-view', LoremView],
  ['movable-demo-view', MovableDemoView],
  ['movable-view', MovableView],
  ['scene-demo-view', SceneDemoView],
  ['svg-demo-view', SvgDemoView],
  ['svg-drawing-view', SvgDrawingView],

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
