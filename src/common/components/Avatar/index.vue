<template lang="pug">
  component(
    :is="isComponentType"
    :class="classes"
    :to="to"
    :style="computeStyle"
    @mouseenter.prevent="handleMouseOver"
    @mouseleave.prevent="handleMouseLeave"
  )
    .ui-debio-avatar__initial(
      v-if="showInitial"
      :style="computeBorderedStyle"
      @click.prevent="handleClick"
    ) {{ initial }}

    img.ui-debio-avatar__image(
      v-else-if="!$slots['icon'] && !showInitial"
      :src="computeAvatarImage"
      :style="computeBorderedStyle"
      @click.prevent="handleClick"
    )

    .ui-debio-avatar__icon(
      v-if="$slots['icon'] && !showInitial"
      :style="computeBorderedStyle"
      @click.prevent="handleClick"
    )
      slot(name="icon")

    .ui-debio-avatar__option(
      v-show="option && !to"
      :aria-expanded="showOption"
      :class="computeOptionStyle"
    )
      .ui-debio-avatar__option-text(
        v-if="showOption"
        role="button"
        :aria-label="optionText"
        @click="handleOptionClick"
      ) {{ optionText }}
</template>

<script>
const allowedRoundedType = /^(circle|default)$/

import { metamaskFoxIcon } from "@/common/icons"

export default {
  name: "UiDebioAvatar",
  props: {
    src: { type: String, default: "" },
    size: { type: [String, Number], default: 44 },
    initial: { type: String, default: null },
    background: { type: String, default: null },
    borderSize: { type: [String, Number], default: 0 },
    borderColor: { type: String, default: "transparent" },
    optionText: { type: String, default: "" },
    elevation: { type: [String, Number], default: null },
    to: { type: [String, Object], default: undefined },
    roundedType: {
      type: String,
      default: "default",
      validator: (type) => allowedRoundedType.test(type)
    },
    option: Boolean,
    active: Boolean,
    rounded: Boolean
  },

  data: () => ({
    showOption: false,
    isHovered: false,
    metamaskFoxIcon
  }),

  computed: {
    isComponentType() {
      return this.to ? "router-link" : "div"
    },

    showInitial() {
      return this.initial && !this.src && !this.$slots["icon"]
    },

    classes() {
      const roundedType = this.roundedType === "default"
        ? "ui-debio-avatar--rounded"
        : "ui-debio-avatar--rounded-circle"

      return [
        "ui-debio-avatar",
        { [roundedType]: this.rounded },
        { [`elevation-${this.elevation}`]: this.elevation }
      ]
    },
    
    computeAvatarImage() {
      return this.src ? this.src : require("@/assets/image-placeholder.png")
    },

    computeStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      }
    },

    computeBorderedStyle() {
      const borderColor = (!this.showOption || !this.isHovered) && !this.to
        ? this.borderColor
        : "#C400A5"
      
      return { border: `solid ${this.borderSize}px ${this.active ? "#C400A5" : borderColor}` }
    },

    computeOptionStyle() {
      return { "ui-debio-avatar__option--opened": this.showOption }
    }
  },

  methods: {
    handleClick() {
      this.$emit("avatarClicked")
    },

    handleOptionClick() {
      this.$emit("optionClicked")
    },

    handleMouseOver() {
      this.showOption = true
      this.isHovered = true
    },

    handleMouseLeave() {
      this.showOption = false
      this.isHovered = false
    }
  }
}
</script>

<style lang="sass">

.ui-debio-avatar
  position: relative
  display: block
  background: #FFFFFF
  text-decoration: none

  &:focus-visible
    outline-color: #C400A5

  &__option
    display: flex
    justify-content: center
    align-items: center
    height: 100%
    color: #C400A5
    position: absolute
    top: 0
    z-index: 1
    right: 50%
    text-align: left
    opacity: 0
    background: #FFFFFF
    border-radius: 0.5rem 10% 10% 0.5rem
    box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
    font-size: 1.125rem
    font-weight: 500
    line-height: 1.688rem
    transition: all cubic-bezier(.7,-0.04,.61,1.14) .3s
    -webkit-touch-callout: none
    -webkit-user-select: none
    -khtml-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none

    &--opened
      width: max-content
      opacity: 1
      padding: 0.5rem 75% 0.5rem 0.938rem

  &__icon
    position: relative
    z-index: 7
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    background: #FFFFFF
    
  &__initial
    position: relative
    z-index: 7
    font-weight: 600
    width: 100%
    height: 100%
    display: flex
    color: #FFFFFF
    background: green
    justify-content: center
    align-items: center
    font-size: 60%
    background: #51459F
    
  &__image
    position: relative
    z-index: 7
    width: 100%
    height: 100%
    object-fit: cover

  &--rounded
    border-radius: 0.25rem

    .ui-debio-avatar__image,
    .ui-debio-avatar__icon,
    .ui-debio-avatar__initial
      border-radius: 0.25rem

  &--rounded-circle
    border-radius: 50%

    .ui-debio-avatar__image,
    .ui-debio-avatar__icon,
    .ui-debio-avatar__initial
      border-radius: 50%
</style>
