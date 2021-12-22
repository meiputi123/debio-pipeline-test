<template lang="pug">
  .ui-debio-modal(:class="classes")
    .ui-debio-modal__wrapper
      .ui-debio-modal__card(v-click-outside="{ handler: handleClickOutside, closeConditional }")
        ui-debio-icon.ui-debio-modal__card-close(
          v-if="!disableDismiss"
          :icon="closeIcon"
          role="button"
          size="13"
          color="#757274"
          stroke
          @click="$emit('onClose', false)"
        )
        .ui-debio-modal__card-title(v-if="showTitle")
          slot(name="title" v-if="$slots['title'] || $scopedSlots['title']")
          span(v-else) {{ title }}

        slot
        ui-debio-icon.ui-debio-modal__card-icon(v-if="!$slots.default" :icon="icon" :view-box="iconViewBox" size="80" stroke)

        .ui-debio-modal__card-cta(v-if="showCta")
          slot(name="cta" v-if="$slots['cta'] || $scopedSlots['cta']")
          Button(
            v-else
            :disabled="ctaDisabled"
            :outlined="ctaOutlined"
            block color="secondary"
            @click="handleCtaAction"
          ) {{ ctaTitle }}
</template>

<script>
import { closeIcon } from "@/common/icons"
import Button from "@/common/components/Button"

const allowedType = /^(alert|form)$/

export default {
  name: "UiDebioModal",
  components: { Button },
  
  props: {
    show: { type: Boolean, default: false },
    disabledIconAnimate: { type: Boolean, default: false },
    title: { type: String, default: "Default title" },
    type: { type: String, default: "alert", validation: val => allowedType.test(val) },
    icon: { type: String, default: null },
    iconViewBox: { type: String, default: "0 0 40 40" },
    ctaTitle: { type: String, default: "Default button" },
    ctaAction: { type: Function, default: () => {} },
    ctaOutlined: { type: Boolean, default: true },
    showCta: { type: Boolean, default: true },
    showTitle: { type: Boolean, default: true },
    ctaDisabled: { type: Boolean, default: false },
    disableDismiss: { type: Boolean, default: false }
  },

  data: () => ({ closeIcon, dismissAnimation: false }),

  computed: {
    classes() {
      return [
        { "ui-debio-modal--active": this.show },
        { "ui-debio-modal--bounced": this.dismissAnimation && this.disableDismiss },
        { "ui-debio-modal--disabled-icon-animate": this.disabledIconAnimate }
      ]
    }
  },

  watch: {
    show: {
      immediate: true,
      handler(val) {
        if (!val) document.querySelector("html").style.overflowY = null
        else document.querySelector("html").style.overflowY = "hidden"
      }
    }
  },

  methods: {
    handleCtaAction() {
      document.querySelector("html").style.overflowY = null
      this.ctaAction()
    },

    handleClickOutside() {
      this.dismissAnimation = true

      this.$nextTick(() => {
        setTimeout(() => {
          this.dismissAnimation = false
        }, 300)
      })


      if (this.show && !this.disableDismiss) this.$emit("onClose", false)
    },

    closeConditional() { return this.show }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .ui-debio-modal
    position: fixed
    top: 0
    left: 0
    z-index: 101
    opacity: 0
    visibility: hidden
    transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &__wrapper
      min-width: 100vw
      min-height: 100vh
      display: flex
      align-items: center
      justify-content: center
      background: rgba(255, 255, 255, .7)

    &__card
      min-width: 18.063rem
      padding: 2.25rem
      position: relative
      display: flex
      max-height: 100vh
      overflow-y: auto
      flex-direction: column
      align-items: center
      gap: 1.875rem
      background: #FFFFFF
      border-radius: 0.25rem
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      transform: translateY(-100vh)
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .25s

      &::-webkit-scrollbar-track
        background-color: #f2f2ff

      &::-webkit-scrollbar
        width: 0.25rem

      &::-webkit-scrollbar-thumb
        border-radius: 0.625rem
        background: #a1a1ff

    &__card-close
      position: absolute !important
      top: 1.25rem
      right: 1.25rem

    &__card-title
      @include body-text-2

    &__card-cta
      width: 100%

    &--active
      opacity: 1
      visibility: visible

      .ui-debio-modal__card
        transform: translateY(0)

      .ui-debio-modal__card-icon
        stroke-dasharray: 1500
        stroke-dashoffset: 1500
        animation: dash linear 5s forwards
        animation-delay: .25s

    &--disabled-icon-animate

      .ui-debio-modal__card-icon
        stroke-dasharray: unset
        stroke-dashoffset: unset
        animation: unset
        animation-delay: unset

    &--bounced
      .ui-debio-modal__card
        animation: bounce .3s

    @keyframes dash
      to
        stroke-dashoffset: 0

    @keyframes bounce
      to
        transform: scale(1)
      to
        transform: scale(1.06)
</style>
