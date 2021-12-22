<template lang="pug"> 
  .customer-request-test
    .customer-request-test__wrapper
      .customer-request-test__nav
        .customer-request-test__nav-button(@click="handleBack")
          v-icon.customer-request-test__nav-icon mdi-chevron-left
      
      .customer-request-test__main
        .customer-request-test__stepper
          ui-debio-stepper( 
            :items="stepperItems"
          )
        
        template
          SelectLocation(
            @onSubmit="toSelectService"
          )
                    
</template>

<script>

import SelectLocation from "./SelectLocation"

export default {
  name: "RequestTest",

  components: {
    SelectLocation
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Location and Service Category", active: true },
      { number: 2, title: "Select Service", active: false },
      { number: 3, title: "Checkout & Payment", active: false },
      { number: 4, title: "Success", active: false }
    ]
  }),

  methods: {
    handleBack() {
      this.$router.push({ name: "customer-dashboard"})
    },

    toSelectService() {
      this.$router.push({ name: "customer-request-test-service"})
    }
  }
}
</script>


<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-request-test
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
