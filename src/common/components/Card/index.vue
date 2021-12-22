<script>
import { defaultIcon } from "@/common/icons"

export default {
  name: "UiDebioCard",
  props: {
    width: { type: [String, Number], default: 245 },
    title: { type: String, default: "Card Title" },
    subTitle: { type: String, default: "Card Subtitle" },
    to: { type: [String, Object], default: undefined },
    elevation: { type: [String, Number], default: null },
    centeredContent: Boolean,
    block: Boolean,
    withDismiss: Boolean,
    tinyCard: Boolean,
    withIcon: Boolean
  },

  data: () => ({ defaultIcon }),

  computed: {
    isComponentType() {
      return this.to && this.tinyCard ? "router-link" : "div"
    },

    computeContentType() {
      return this.tinyCard
        ? "ui-debio-card--tiny"
        : "ui-debio-card--default"
    },

    classes() {
      return [
        "ui-debio-card",
        this.computeContentType,
        { [`elevation-${this.elevation}`]: this.elevation },
        { "ui-debio-card--centered": this.centeredContent && this.tinyCard }
      ]
    },

    computeStyle() {
      return {
        width: this.block ? "100%" : `${this.width}px`
      }
    }
  },

  methods: {
    handleClick() {
      this.$emit("click")
    },

    handleDismiss() {
      this.$emit("dismiss")
    }
  }
}
</script>

<template lang="pug">
  component(
    :is="isComponentType"
    :to="to"
    :class="classes"
    :style="computeStyle"
    @click.prevent="handleClick"
  )
    .ui-debio-card__content
      template(v-if="tinyCard")
        .ui-debio-card__icon(v-if="withIcon || $slots['icon']")
          slot(name="icon" v-if="$slots['icon'] || $scopedSlots['icon']")
          ui-debio-icon(v-else :icon="defaultIcon" stroke color="#51459F")

        .ui-debio-card__title
          slot(name="title" v-if="$slots['title'] || $scopedSlots['title']")
          span(v-else :aria-label="title") {{ title }}

        .ui-debio-card__sub-title
          slot(name="subtitle" v-if="$slots['subtitle'] || $scopedSlots['subtitle']")
          span(v-else :aria-label="subTitle") {{ subTitle }}

      template(v-else)
        .ui-debio-card__header(
          v-if="$slots['header'] || $scopedSlots['header']"
          :class="{ 'ui-debio-card__header--dismissable': withDismiss }"
        )
          .ui-debio-card__header-dismiss(v-if="withDismiss" role="button" @click="handleDismiss")
            v-icon mdi-close
          slot(name="header")

        .ui-debio-card__body(v-if="$slots['default']")
          slot

        .ui-debio-card__footer(v-if="$slots['footer'] || $scopedSlots['footer']")
          slot(name="footer")
</template>

<style lang="sass">

.ui-debio-card
  z-index: 1
  text-decoration: none
  position: relative
  padding: 1.125rem
  transition: .3s all ease-in-out
  border-radius: 0.25rem
  box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
  background: #FFFFFF
  display: block

  &--default
    padding: 0

  &:focus-visible
    outline-color: #C400A5

  &__icon
    margin-bottom: 0.625rem

  &__header
    position: relative
    padding: 0.625rem 1.563rem
    border-radius: 0.25rem 0.25rem 0 0
    box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)

    &--dismissable
      padding-right: 1.438rem

  &__body
    position: relative
    padding: 1.563rem

  &__footer
    position: relative
    padding: 0.625rem 1.563rem

  &__header-dismiss
    position: absolute
    top: 0
    right: 0
  
  &__title
    font-weight: 600
    font-size: 1.125rem
    line-height: 150%
    color: #363636
    margin-bottom: 0.125rem

  &__sub-title
    font-size: 0.75rem
    line-height: 120%
    color: #757274
  
  &--centered
    .ui-debio-card__content
      display: flex
      flex-direction: column
      align-items: center
      text-align: center
</style>
