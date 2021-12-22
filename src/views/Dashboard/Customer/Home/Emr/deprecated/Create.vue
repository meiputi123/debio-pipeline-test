<template lang="pug">
  .customer-create-emr
    .customer-create-emr__wrapper
      .customer-create-emr__nav
        .customer-create-emr__nav-button(@click="handleBack")
          v-icon.customer-create-emr__nav-icon mdi-chevron-left
          span {{ computeBackWord }}
      .customer-create-emr__main
        .customer-create-emr__stepper
          ui-debio-stepper(:items="stepper" with-line-indicator)

        .customer-create-emr__forms
          transition(name="transition-slide-x" mode="out-in")
            keep-alive
              Upload(
                v-if="currentStep === 1"
                @uploadFormError="error = $event"
                @uploadFulfilled="handleUploadPayload"
              )
              Confirm(
                v-if="currentStep === 2"
                :payload="dataForConfirm"
                :showModal="showModal"
                @confirmFormError="error = $event"
                @confirmFulfilled="handleConfirmPayload"
                @showModal="showModal = $event"
              )
          Button(block height="40" color="secondary" @click="handleContinue") Continue
</template>

<script>
import Button from "@/common/components/Button"
import Upload from "./Upload"
import Confirm from "./Confirm"

export default {
  name: "CustomerEmrCreate",

  components: { Button, Upload, Confirm },

  data: () => ({
    error: null,
    showModal: false,
    currentStep: 1,
    dataForConfirm: null,
    stepper: [
      {
        number: 1,
        title: "Select a File",
        active: true
      },
      {
        number: 2,
        title: "Upload",
        active: false
      }
    ]
  }),

  computed: {
    computeBackWord() {
      return this.currentStep === 1 ? "Back to My EMR" : "Back to Create EMR"
    },

    computeDisabled() {
      return this.error?.step === this.currentStep && this.error?.status
    }
  },

  created() {
    if (!this.dataForConfirm) this.currentStep = 1
  },

  methods: {
    handleBack() {
      this.currentStep < 2 ? this.$router.push({ name: "customer-emr" }) : this.currentStep--

      this.stepper = this.stepper.map(step => ({ ...step, active: step.number <= this.currentStep }))
    },

    handleContinue() {
      const touchForms = this.$children.filter(a => a._touchForms)
      touchForms[this.currentStep - 1]._touchForms()
      if (this.computeDisabled) return
      this.currentStep < 2 ? this.currentStep++ : this.showModal = true

      this.stepper = this.stepper.map(step => ({ ...step, active: step.number <= this.currentStep }))
    },

    handleUploadPayload(payload) {
      this.dataForConfirm = payload
    },

    handleConfirmPayload() {
      // TODO: Do something with these payload
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-create-emr
    width: 100%
    height: 100%

    &__wrapper
      width: 100%
      height: 100%
      background: #FFFFFF
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      border-radius: 0.25rem

    &__nav
      padding: 2.313rem 3.125rem

    &__nav-icon
      border-radius: 0.063rem
      color: #D3C9D1 !important
      background: #F5F7F9
      
    &__nav-button
      display: flex
      align-items: center
      gap: 0.625rem
      max-width: max-content
      color: #757274
      cursor: pointer
      @include body-text-3

    &__main
      width: 100%
      display: flex
      flex-direction: column
      align-items: center

    &__forms
      padding-bottom: 6rem
      display: flex
      flex-direction: column
      align-items: center
      gap: 2.063rem
      margin-top: 3.25rem
      width: 39.188rem

    &__upload
      width: 100%

    &__confirm
      width: 100%

    .transition-slide-x
      &-enter-active,
      &-leave-active
        transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

      &-enter
        opacity: 0
        transform: translateX(1.563rem)

      &-leave-to
        opacity: 0
        transform: translateX(-12.813rem)
</style>
