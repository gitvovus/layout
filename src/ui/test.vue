<template>
<div></div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Observer
@Component
export default class Test extends Vue {
  @Prop() private width!: number;
  @Prop() private height!: number;
  @Prop() private title!: string;
  @Prop() private text!: string;

  private mounted() {
    console.log(`width : ${typeof(this.width)} ${this.width}\nheight: ${typeof(this.height)} ${this.height}\ntitle : ${typeof(this.title)} ${this.title}\ntext  : ${typeof(this.text)} ${this.text}`);
  }
}
</script>
