<template lang="pug">
  .customer-payment-success
    .customer-payment-success__title Thank you for your order!
    .customer-payment-success__sub-title Please proceed to send sample
      

    template
      v-row.customer-payment-success__row
        LabDetailCard
        PaymentDetailCard(
          :success="isSuccess"
        )

  
</template>
<script>

import LabDetailCard from "../LabDetailCard.vue"
import PaymentDetailCard from "../PaymentDetailCard.vue"

export default {
  name: "PaymentSuccess",

  components: {
    LabDetailCard,
    PaymentDetailCard
  },

  data: () => ({
    isSuccess: true
  }),

  methods: {
    onContinue () {
      this.$emit("onContinue")
    }
  }


}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-payment-success
    width: 100%
    height: 100% 
    display: flex
    flex-direction: column
    align-items: center

    &__title
      display: flex
      flex-direction: column
      align-items: center
      text-align: center
      letter-spacing: 0.0044em !important
      margin-top:55px
      @include h6-opensans

    &__sub-title
      align-items: center
      @include body-text-1

    &__row
      margin-top: 3.5rem !important
      display: flex
      justify-content: center

</style>
