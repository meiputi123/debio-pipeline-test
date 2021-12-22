<template lang="pug">
  .customer-create-emr__confirm
    .emr-confirm
      ui-debio-modal(
        :show="showModal"
        :icon="checkCircleIcon"
        :cta-action="backToEmr"
        title="Upload Successful"
        cta-title="Back to My EMR"
        @onClose="$emit('showModal', false)"
      )

      .emr-confirm__legend You are going to upload a file. Please enter your password to encrypt the file.

      .emr-confirm__card
        .emr-confirm__card-header
          span.emr-confirm__card-title {{ payload.title }}
          p.emr-confirm__card-subtitle.m-0 {{ payload.category }}

        .emr-confirm__card-body
          .emr-confirm__card-description
            .emr-confirm__description-text {{ payload.description }}
          .emr-confirm__card-file
            ui-debio-icon.emr-confirm__file-icon(:icon="fileTextIcon" size="44" stroke)
            .emr-confirm__file-name {{ payload.file.name }}

      ui-debio-input.emr-confirm__password(
        v-model="password"
        :errorMessages="errorMessages"
        :rules="$options.rules.password"
        :type="inputType"
        variant="small"
        placeholder="Password"
        outlined
        block
        @isError="handleError"
      ) You are going to upload a file. Please enter your password to encrypt the file.
        ui-debio-icon(
          slot="icon-append"
          :icon="computeIcon"
          size="20"
          :color="computeColor"
          stroke
          role="button"
          @click="changeInputType()"
        )
</template>

<script>
import { eyeOffIcon, eyeIcon, fileTextIcon, checkCircleIcon } from "@/common/icons"
import { validateForms } from "@/common/lib/validate"
import Button from "@/common/components/Button"
import errorMessage from "@/common/constants/error-messages"

export default {
  name: "CustomerEmrConfirm",
  mixins: [validateForms],

  components: { Button },

  props: {
    payload: { type: Object, default: () => {} },
    showModal: { type: Boolean, default: false }
  },

  data: () => ({
    errorMessage,

    inputType: "password",
    password: "",
    eyeOffIcon,
    eyeIcon,
    fileTextIcon,
    checkCircleIcon
  }),

  computed: {
    computeIcon() {
      return this.inputType === "password" ? eyeOffIcon : eyeIcon
    },

    computeColor() {
      return this.inputType === "password" ? "#757274" : "#5640a5"
    }
  },

  watch: {
    computeError(state) {
      const payload = state ? null : this.password

      this.$emit("confirmFulfilled", payload)
      this.$emit("confirmFormError", { step: 2, status: state })
    },

    password(password) {
      if (this.computeError) this.$emit("confirmFulfilled", password)
    }
  },

  rules: {
    password: [ val => (val && val.length >= 8) || errorMessage.PASSWORD(8) ]
  },

  methods: {
    changeInputType() {
      this.inputType = this.inputType === "password" ? "text" : "password"
    },

    backToEmr() {
      this.$emit("showModal", false)
      this.$router.push({ name: "customer-emr" })
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .emr-confirm
    display: flex
    flex-direction: column
    align-items: center
    gap: 2rem
    
    &__legend
      @include body-text-medium-2

    &__card
      width: 100%
      padding: 1.375rem 2.313rem
      border: 0.125rem solid #F5F7F9
      border-radius: 0.5rem

    &__card-body
      display: flex
      align-items: center

    &__card-title
      @include body-text-medium-1

    &__card-subtitle
      text-transform: capitalize
      color: #757274
      @include body-text-medium-3

    &__card-description
      min-width: 25.313rem
      max-width: 25.313rem
      padding: .5rem 0
      padding-right: 1.563rem
      border-right: 0.063rem solid #D3C9D1

    &__card-file
      padding: .5rem 0
      padding-left: 1.563rem
      display: flex
      flex-direction: column
      align-items: center
      gap: 1.25rem

    &__file-name
      color: #757274
      @include body-text-medium-3

    &__description-text
      display: -webkit-box
      -webkit-line-clamp: 3
      -webkit-box-orient: vertical  
      overflow: hidden
      @include body-text-2
</style>
