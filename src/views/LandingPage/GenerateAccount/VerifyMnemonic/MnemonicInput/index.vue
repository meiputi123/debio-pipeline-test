<style lang='scss'>
.mnemonic-textbox{
  width: 502px;
  border: 1px solid #757274;
  border-radius: 8px;

  padding: 15px 15px 5px 15px;

  margin-bottom: 35px !important;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  & > div > .mnemonic-list-item {
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

    margin-bottom: 10px;

    box-shadow: 0px -3px 80px rgba(0, 0, 0, 0.07), 0px -0.904412px 24.1177px rgba(0, 0, 0, 0.0456112), 0px -0.375647px 10.0172px rgba(0, 0, 0, 0.035), 0px -0.135864px 3.62304px rgba(0, 0, 0, 0.0243888);
  }
}
.transparent{
  opacity: 0;
  cursor: default;
}
</style>

<template lang='pug'>
  div
    div.mnemonic-textbox
        div(:key='i' v-for='(mnemonics, i) in chunkedMnemonic')
          v-btn(
            color="secondary"
            elevation='0'
            class='mnemonic-list-item'
            v-for='(mnemonic, y) in mnemonics'
            :key='y'
            outlined
            @click="() => remove(mnemonic)"
          ) {{ mnemonic }}
    MnemonicKeypad(
      :mnemonicCollection="mnemonicCollection",
      @click="(mnemonic) => input(mnemonic)"
    )
</template>

<script>
import { chunk } from "@/common/lib/arrays"
import MnemonicKeypad from "./MnemonicKeypad.vue"

export default {
  name: "MnemonicInput",
  components: {
    MnemonicKeypad
  },
  props: {
    mnemonicCollection: Array
  },
  data: () => ({
    mnemonicInput: []
  }),
  computed: {
    chunkedMnemonic() {
      return chunk(this.mnemonicInput , 6)
    }
  },
  methods: {
    input(mnemonic) {
      this.mnemonicInput.push(mnemonic)
      this.$emit("click", this.mnemonicInput)
    },

    remove(mnemonic) {
      const index = this.mnemonicInput.indexOf(mnemonic)
      if (index !== -1) {
        this.mnemonicInput.splice(index, 1)
      }
      this.mnemonicCollection.push(mnemonic)
      this.$emit("click", this.mnemonicInput)
    }
  }
}
</script>
