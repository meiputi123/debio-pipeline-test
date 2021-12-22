<template lang="pug"> 
  .customer-select-service
    .customer-select-service__wrapper
      .customer-select-service__nav
        .customer-select-service__nav-button(@click="handleBack")
          v-icon.customer-select-service__nav-icon mdi-chevron-left
      
      .customer-select-service__main
        .customer-select-service__stepper
          ui-debio-stepper( 
            :items="stepperItems"
          )
        
        template
          SelectService(
            :staking="staking"
            @onSubmit="toPaymentCheckout"
          )
                    
</template>

<script>

import SelectService from "./SelectService"

export default {
  name: "SelectServicePage",

  components: {
    SelectService
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Location and Service Category", active: false },
      { number: 2, title: "Select Service", active: true },
      { number: 3, title: "Checkout & Payment", active: false },
      { number: 4, title: "Success", active: false }
    ],
    isSelectLocation: true,
    isSelectService: false,
    itosPaymentCheckout: false,
    isSuccessPage: false,
    showNoLab: false,
    staking: false
  }),


  async mounted () {
    if (this.$route.params.flag === "staking") {
      this.staking = true
    }

    if (!this.services.length) {
      this.showNoLab = true
    }

  },

  methods: {
    handleBack() {
      this.$router.push({ name: "customer-request-test"})
    },

    toPaymentCheckout () {
      this.$router.push({ name: "customer-request-test-checkout"})
    }
  }
}
</script>


<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-select-service
    width: 100%
    height: 100%
    background: #FFFFFF

    &__wrapper
      width: 100%
      height: 100%
      background: #FFFFFF
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      border-radius: 0.25rem

    &__nav
      padding: 2.313rem 3.125rem

    &__nav-button
      display: flex
      align-items: center
      gap: 0.625rem
      max-width: max-content
      color: #757274
      cursor: pointer
      @include body-text-3

    &__main
      padding-bottom: 100px
      width: 100%
      display: flex
      flex-direction: column
      align-items: center

</style>
