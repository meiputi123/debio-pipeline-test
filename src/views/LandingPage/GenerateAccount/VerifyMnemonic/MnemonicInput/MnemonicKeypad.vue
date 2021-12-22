<style scoped lang="scss">
.mnemonic-list-item{
  width: 75px;
  height: 28px !important;

  display: inline-block;

  /* body-text-2-medium */

  font-family: Raleway;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;
  text-transform: none;

  border-radius: 50px;
  /* or 22px */

  display: flex;
  align-items: center;
  text-align: center;

  margin-right: 5px;
  margin-bottom: 10px;

  box-shadow: 0px -3px 80px rgba(0, 0, 0, 0.07), 0px -0.904412px 24.1177px rgba(0, 0, 0, 0.0456112), 0px -0.375647px 10.0172px rgba(0, 0, 0, 0.035), 0px -0.135864px 3.62304px rgba(0, 0, 0, 0.0243888);
}

div {
  & > div.set-width {
    width: 502px;
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
          outlined
          color="secondary"
          elevation='0'
          class='mnemonic-list-item'
          v-for='(mnemonic, y) in mnemonics'
          :key='y'
          @click="clickMnemonic(mnemonic)"
        ) {{ mnemonic }}
</template>

<script>
import { chunk } from "@/common/lib/arrays"

export default {
  name: "MnemonicKeypad",
  props: {
    mnemonicCollection: Array
  },
  computed: {
    chunkedMnemonic() {
      return chunk(this.mnemonicCollection, 6)
    }
  },
  methods: {
    clickMnemonic(mnemonic){
      const index = this.mnemonicCollection
        .indexOf(mnemonic)
      this.mnemonicCollection
        .splice(index, 1)

      this.$emit("click", mnemonic)
    }
  }
}
</script>
