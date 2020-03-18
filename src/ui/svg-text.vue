<script lang="ts">
import { Observer } from 'mobx-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Item } from '@/lib/svg';

@Observer
@Component
export default class UiSvgText extends Vue {
  @Prop() private model!: Item;

  private render(h: any) {
    // Hacky: _v method references to createTextVNode function, see Vue sources.
    return (this as any)._v(this.model.text);
  }
}
</script>
