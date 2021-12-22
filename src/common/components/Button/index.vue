<template lang="pug">
  v-btn(
    depressed
    :color="color"
    :width="width"
    @click="onClick"
    :disabled="disabled"
    :loading="loading"
    :outlined="outlined"
    :block="block"
    :to="to"
    :height="height"
    :dark="dark"
  )
    slot
</template>

<script>
export default {
  name: "Button",
  props: {
    to: { type: [String, Object], default: null},
    color: { type: String, default: "white"},
    dark: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    width: { type: [String, Number], default: "203px" },
    outlined: { type: Boolean, default: false },
    height: String
  },
  mounted() {
    this.changeStyle()
  },
  methods: {
    onClick(e) {
      this.$emit("click", e)
    },

    changeStyle() {
      // TODO: Do something
    }
  }
}
</script>
