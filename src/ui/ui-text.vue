<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Item } from '@/lib/svg';

@Observer
@Component
export default class UiText extends Vue {
  @Prop() private model!: Item;

  private render(h: any) {
    // Hacky: _v method references to createTextVNode function, see Vue sources.
    return (this as any)._v(this.model.text);
  }
}
</script>
