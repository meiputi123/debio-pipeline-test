<template lang="pug">
  .ui-debio-textarea(:class="classes" :style="computeStyle")
    label.ui-debio-textarea__label(:for="uuid" v-if="label" :aria-label="label") {{ label }}

    .ui-debio-textarea__wrapper
      textarea.ui-debio-textarea__input(
        v-bind="$attrs"
        v-on="listeners"
        :autocomplete="autocomplete"
        :spellcheck="spellcheck"
        :disabled="disabled"
        @click="focus = true"
        @blur="handleBlur"
        :id="uuid"
        ref="input"
        :readOnly="readOnly"
      )

    .ui-debio-textarea__error-message(v-if="computeErrorMessage") {{ computeErrorMessage }}
</template>

<script>
import { alertIcon } from "@/common/icons"
import { validateInput } from "@/common/lib/validate"

export default {
  name: "UiDebioTextArea",
  mixins: [validateInput],

  inheritAttrs: false,

  props: {
    autocomplete: { type: String, default: "off" },
    spellcheck: { type: String, default: "false" },
    label: { type: String, default: null },
    width: { type: [Number, String], default: 200 },
    variant: { type: String, default: "default" },

    validateOnBlur: Boolean,
    outlined: Boolean,
    disabled: Boolean,
    readOnly: Boolean,
    block: Boolean
  },

  data: () => ({ focus: false, alertIcon }),

  computed: {
    classes() {
      return [
        { "ui-debio-textarea--disabled": this.disabled },
        { "ui-debio-textarea--outlined": this.outlined },
        { "ui-debio-textarea--errored": (this.isError && this.isError?.length) || (this.error && this.errorMessages) },
        { "ui-debio-textarea--default": this.variant === "default" },
        { "ui-debio-textarea--small": this.variant === "small" },
        { "ui-debio-textarea--large": this.variant === "large" },
        { "ui-debio-textarea--read-only": this.readOnly },
        { "ui-debio-textarea--active": this.focus }
      ]
    },

    computeStyle() {
      return {
        width: this.block ? "100%" : `${this.width}px`
      }
    },

    listeners() {
      return {
        ...this.$listeners,
        input: event => {
          this.$emit("input", event.target.value)
        }
      }
    }
  },

  watch: {
    "$attrs.value": {
      handler(newVal, oldVal) {
        if (this.validateOnBlur && !!oldVal && !this.isError?.length) return
        else this._handleError(newVal)
      }
    },

    error: {
      deep: true,
      immediate: true,
      handler(val, oldVal) {
        if (oldVal) this.isError = null
        if (!val) return

        this._handleError(this.$attrs.value)
      }
    }
  },

  methods: {
    handleBlur() {
      if (this.validateOnBlur) this._handleError(this.$attrs.value)
      this.focus = false
    },

    _handleError(value) {
      const error = this.rules.reduce((filtered, rule) => {
        const isError = rule.call(this, value)

        if (typeof isError !== "boolean") filtered.push({ message: isError })

        return filtered
      }, [])
      this.$emit("isError", this.uuid, Boolean(error.length))

      this.isError = error
    }
  }
}
</script>

<style lang="sass">
@import "@/common/styles/mixins.sass"
.ui-debio-textarea
  transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
  
  &__label
    margin-bottom: 0.75rem
    transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
    display: flex
    align-items: center
    justify-content: space-between

  &__wrapper
    background: #FFFFFF
    position: relative
    box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
    border-radius: 0.25rem
    cursor: text
    display: flex
    border: solid 0.125rem transparent
    transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

  &__input
    cursor: inherit
    height: 100%
    width: 100%
    padding: 0.875rem 1.125rem
    font-size: 1rem
    color: black
    resize: vertical
    @include body-text-medium-3

    &:focus
      outline: none

  &__error-message
    color: #C400A5
    margin-top: 0.5rem

  &--disabled
    .ui-debio-textarea__wrapper
      overflow: hidden
      background: #F5F5F5

      input
        cursor: not-allowed
        color: #757274

  &--read-only
    .ui-debio-textarea__input
      cursor: default

  &--outlined
    .ui-debio-textarea__wrapper
      border-color: #757274
      box-shadow: unset

  &--default
    .ui-debio-textarea__label
      @include body-text-2

    .ui-debio-textarea__wrapper
      min-height: 6.25rem

    .ui-debio-textarea__input
      @include body-text-medium-2

    .ui-debio-textarea__error-message
      @include body-text-2

  &--small
    .ui-debio-textarea__label
      @include body-text-4

    .ui-debio-textarea__wrapper
      min-height: 4.688rem

    .ui-debio-textarea__input
      @include body-text-medium-3

    .ui-debio-textarea__error-message
      @include body-text-4

  &--large
    .ui-debio-textarea__label
      @include body-text-1

    .ui-debio-textarea__wrapper
      min-height: 9.375rem

    .ui-debio-textarea__input
      @include body-text-medium-1

    .ui-debio-textarea__error-message
      @include body-text-1

  &--active
    .ui-debio-textarea__wrapper
      border-color: #5640A5 !important

    .ui-debio-textarea__label
      color: #5640A5 !important

  &--errored
    animation: shake .10s cubic-bezier(.7, -0.04, .61, 1.14)

    @keyframes shake
      0%
        transform: translate(-0.25rem, 0)
      50%
        transform: translate(0, 0)
      75%
        transform: translate(-0.25rem, 0)
      90%
        transform: translate(0, 0)
      100%
        transform: translate(-0.25rem, 0)
    
    .ui-debio-textarea__wrapper
      border-color: #C400A5 !important
</style>
