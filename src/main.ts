import Vue, { VueConstructor } from 'vue';
import '@/styles/main.scss';

import BtnToggle from '@/ui/btn-toggle.vue';
import Floating from '@/ui/floating.vue';
import Layout from '@/ui/layout.vue';
import Lorem from '@/ui/lorem.vue';
import Mockup from '@/ui/mockup.vue';
import Test from '@/ui/test.vue';

import { Application } from '@/modules/application';

Vue.config.productionTip = false;

(<Array<[string, VueConstructor]>> [
  ['btn-toggle', BtnToggle],
  ['floating', Floating],
  ['layout', Layout],
  ['lorem', Lorem],
  ['mockup', Mockup],
  ['test', Test],
]).forEach(([name, constructor]) => Vue.component(name, constructor));

new Application().run();
