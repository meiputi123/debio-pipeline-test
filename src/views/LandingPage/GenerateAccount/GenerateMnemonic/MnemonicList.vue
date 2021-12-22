<style scoped lang="scss">
.mnemonic-list-item{
  width: 110px;
  height: 26px !important;

  display: inline-block;

  /* body-text-2-medium */

  font-family: Raleway;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;

  line-height: 150%;
  text-transform: none;

  border-radius: 50px;
  /* or 22px */

  display: flex;
  align-items: center;
  text-align: center;

  margin-right: 10px;
  margin-bottom: 15px;

  box-shadow: 0px -3px 80px rgba(0, 0, 0, 0.07), 0px -0.904412px 24.1177px rgba(0, 0, 0, 0.0456112), 0px -0.375647px 10.0172px rgba(0, 0, 0, 0.035), 0px -0.135864px 3.62304px rgba(0, 0, 0, 0.0243888);
}

div {
  & > div.set-width {
    width: 504px;
  }
}
</style>

<template lang='pug'>
    div
      div(
        class='d-flex'
        :key='i'
        v-for='(mnemonics, i) in chunkedMnemonic'
      )
        v-btn(
          color="secondary"
          elevation='0'
          class='white--text mnemonic-list-item'
          v-for='(mnemonic, y) in mnemonics'
          :key='y'
        ) {{ y + (i * chuckLength) + 1 }} {{ mnemonic }}
</template>

<script>
import { chunk } from "@/common/lib/arrays"

export default {
  name: "MnemonicList",
  props: {
    mnemonicCollection: Array
  },
  data: () => ({
    chuckLength: 4
  }),
  computed: {
    chunkedMnemonic() {
      return chunk(this.mnemonicCollection, this.chuckLength)
    }
  }
}
</script>
