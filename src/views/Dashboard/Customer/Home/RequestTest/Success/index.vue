<template lang="pug"> 
  .customer-success
    .customer-success__wrapper
      .customer-success__nav
        .customer-success__nav-button(@click="handleBack")
          v-icon.customer-success__nav-icon mdi-chevron-left
      
      .customer-success__main
        .customer-success__stepper
          ui-debio-stepper( 
            :items="stepperItems"
          )
        
        template
          PaymentSuccess
          
</template>

<script>

import PaymentSuccess from "./PaymentSuccess"




export default {
  name: "Success",

  components: {
    PaymentSuccess
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Location and Service Category", active: false },
      { number: 2, title: "Select Service", active: false },
      { number: 3, title: "Checkout & Payment", active: false },
      { number: 4, title: "Success", active: true }
    ]
  }),

  methods: {
    handleBack() {
      this.$router.push({ name: "customer-request-test-checkout"})
    }
  }
}
</script>


<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-success
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
