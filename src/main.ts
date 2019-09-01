import Vue, { VueConstructor } from 'vue';
import '@/style/main.scss';

import BtnToggle from '@/ui/btn-toggle.vue';
import Controls from '@/ui/controls.vue';
import Layout from '@/ui/layout.vue';
import Lorem from '@/ui/lorem.vue';
import Mockup from '@/ui/mockup.vue';
import View2d from '@/ui/view-2d.vue';

import UiButton from '@/ui/ui-button.vue';
import UiDialog from '@/ui/ui-dialog.vue';
import UiElement from '@/ui/ui-element.vue';
import UiText from '@/ui/ui-text.vue';

import { Application } from '@/modules/application';

Vue.config.productionTip = false;

(<Array<[string, VueConstructor]>> [
  ['btn-toggle', BtnToggle],
  ['controls', Controls],
  ['layout', Layout],
  ['lorem', Lorem],
  ['mockup', Mockup],
  ['view-2d', View2d],
  ['ui-button', UiButton],
  ['ui-dialog', UiDialog],
  ['ui-element', UiElement],
  ['ui-text', UiText],
]).forEach(([name, constructor]) => Vue.component(name, constructor));

new Application().run();
