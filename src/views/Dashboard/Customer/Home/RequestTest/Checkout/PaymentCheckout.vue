<template lang="pug">
  .customer-payment-checkout
    .customer-payment-checkout__title(v-if="isCancelled") You have cancelled your order!
    .customer-payment-checkout__title(v-else) Checkout your order!

    template
      v-row.customer-payment-checkout__row
        LabDetailCard
        PaymentDetailCard(
          @cancel="isCancelled = true"
          @onContinue="onContinue"
        )


</template>

<script>

import { mapState } from "vuex"
import LabDetailCard from "../LabDetailCard.vue"
import PaymentDetailCard from "../PaymentDetailCard.vue"
import { getOrdersData } from "@/common/lib/polkadot-provider/query/orders.js"


export default {
  name: "PaymentCheckout",

  components: {
    LabDetailCard,
    PaymentDetailCard
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api
    })
  },

  data: () => ({
    isCancelled: false
  }),

  async mounted () {
    if (this.$route.params.id) {
      const detailOrder = await getOrdersData(this.api, this.$route.params.id)
      if (detailOrder.status === "Cancelled") {
        this.isCancelled = true
      }
    }
  },

  methods: {
    onContinue () {
      this.$router.push({ name: "customer-request-test-service"})
    }
  }


}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-payment-checkout
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

    &__row
      margin-top: 3.5rem !important
      display: flex
      justify-content: center

</style>
