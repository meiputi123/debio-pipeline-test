<template lang="pug">
  .ui-debio-file(:class="classes" @click="active = true" v-click-outside="{ handler: handleBlur, closeConditional }")
    .ui-debio-file__label(v-if="label" :aria-label="label")
      span {{ label }}

    .ui-debio-file__wrapper
      input.ui-debio-file__input(type="file" ref="input-file" :accept="accept" @change="handleFileChange")
      ui-debio-input(block read-only :variant="variant" outlined :value="computeFileName" :placeholder="computeButtonLabel")
        v-icon(slot="icon-append" v-if="selectedFile" size="15" @click="handleClearFile") mdi-window-close
      Button.ui-debio-file__button(:color="computeButtonVariant" height="40" @click="handleChooseFile") {{ computeButtonLabel }}

    .ui-debio-file__error-message(v-if="computeErrorMessage") {{ computeErrorMessage }}
</template>

<script>
import Button from "@/common/components/Button"
import { alertIcon } from "@/common/icons"
import { validateInput } from "@/common/lib/validate"

export default {
  name: "UiDebioFile",
  mixins: [validateInput],

  components: { Button },

  props: {
    accept: { type: [Array, String], default: () => [".docx", ".pdf", ".doc"] },
    label: { type: String, default: null },
    placeholder: { type: String, default: "Choose File" },
    variant: { type: String, default: "default" },
    validateOnBlur: Boolean,
    clearFile: Boolean
  },

  data: () => ({ selectedFile: null, active: false, alertIcon }),

  computed: {
    classes() {
      return [
        { "ui-debio-file--default": this.variant === "default" },
        { "ui-debio-file--small": this.variant === "small" },
        { "ui-debio-file--large": this.variant === "large" },
        { "ui-debio-file--errored": (this.isError && this.isError?.length) || (this.error && this.errorMessages) }
      ]
    },

    computeButtonVariant() {
      return this.isError && this.isError?.length ? "primary" : "secondary"
    },

    computeFileName() {
      return this.selectedFile?.name || ""
    },

    computeButtonLabel() {
      return this.$attrs.value ? "Change File" : this.placeholder
    }
  },

  watch: {
    selectedFile(newVal, oldVal) {
      if (this.validateOnBlur && !!oldVal && !this.isError?.length) return
      else this._handleError(newVal)
    },

    error: {
      deep: true,
      immediate: true,
      handler(val, oldVal) {
        if (oldVal) this.isError = null
        if (!val) return

        this._handleError(this.selectedFile)
      }
    },

    clearFile(val) {
      if (val) this.handleClearFile()
      else this.selectedFile = this.$attrs.value
    }
  },

  methods: {
    handleChooseFile() {
      if (this.$refs["input-file"]) this.$refs["input-file"].click()
    },

    handleFileChange(event) {
      if (!event.target.value) return

      this.selectedFile = event.target.files[0]
      this.$emit("input", this.selectedFile)
    },

    handleClearFile() {
      if (this.$refs["input-file"]) this.$refs["input-file"].value = ""
      this.selectedFile = null
      this.$emit("input", this.selectedFile)
    },

    _handleError(val) {
      const error = this.rules.reduce((filtered, rule) => {
        const isError = rule.call(this, val)

        if (typeof isError !== "boolean") filtered.push({ message: isError })

        return filtered
      }, [])

      this.$emit("isError", this.uuid, Boolean(error.length))

      this.isError = error
    },

    handleBlur() {
      this.$nextTick(() => {
        if (this.validateOnBlur && this.active && !this.clearFile) this._handleError(this.selectedFile)
        this.active = false
      })
    },

    closeConditional() { return this.active }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .ui-debio-file
    width: 100%

    &__label
      margin-bottom: 0.75rem
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
      display: flex
      align-items: center
      justify-content: space-between

    &__wrapper
      display: flex
      gap: 1rem

    &__input
      display: none

    &__error-message
      color: #C400A5
      margin-top: 0.5rem

    &--default
      .ui-debio-file__label
        @include body-text-2

      .ui-debio-file__button
        height: 2.938rem !important

      .ui-debio-file__input
        @include body-text-medium-2

      .ui-debio-file__error-message
        @include body-text-2

    &--small
      .ui-debio-file__label
        @include body-text-4

      .ui-debio-file__button
        height: 2.5rem !important

      .ui-debio-file__input
        @include body-text-medium-3

      .ui-debio-file__error-message
        @include body-text-4

    &--large
      .ui-debio-file__label
        @include body-text-1

      .ui-debio-file__button
        height: 3.688rem !important

      .ui-debio-file__input
        @include body-text-medium-1

      .ui-debio-file__error-message
        @include body-text-1

    &--errored
      animation: shake .10s cubic-bezier(.7, -0.04, .61, 1.14)

      .ui-debio-input__wrapper
        border-color: #C400A5 !important

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
</style>
