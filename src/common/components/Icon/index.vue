<script>
export default {
  name: "UiDebioIcon",

  props: {
    icon: { type: String, default: null },
    size: { type: [String, Number], default: 40 },
    width: { type: [String, Number], default: null },
    height: { type: [String, Number], default: null },
    viewBox: { type: String, default: "0 0 40 40" },
    strokeWidth: { type: [String, Number], default: "2" },
    color: { type: String, default: "#C400A5" },
    fill: Boolean,
    stroke: Boolean
  },

  computed: {
    fillColor() {
      return this.fill ? "currentColor" : "transparent"
    },

    strokeColor() {
      return this.stroke ? "currentColor" : "transparent"
    },

    computeStyle() {
      return { color: this.color }
    },

    computeStrokeWidth() {
      if (this.stroke) return `${this.strokeWidth}`

      return ""
    }
  }
}
</script>

<template lang="pug">
  .ui-debio-icon
    svg(
      :width="width ? width : size"
      :height="height ? height : size"
      v-html="icon"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="viewBox"
      :fill="fillColor"
      :stroke="strokeColor"
      :stroke-width="computeStrokeWidth"
      :style="computeStyle"
      v-on="$listeners"
      aria-hidden="true"
      role="presentation"
    )
</template>

<style lang="sass">
.ui-debio-icon
  transition: all cubic-bezier(.7,-0.04,.61,1.14) .3s
  display: flex
</style>
