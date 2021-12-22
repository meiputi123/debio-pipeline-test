<template lang="pug"> 
  .customer-payment-checkout
    .customer-payment-checkout__wrapper
      .customer-payment-checkout__nav
        .customer-payment-checkout__nav-button(@click="handleBack")
          v-icon.customer-payment-checkout__nav-icon mdi-chevron-left
      
      .customer-payment-checkout__main
        .customer-payment-checkout__stepper
          ui-debio-stepper( 
            :items="stepperItems"
          )
        
        template
          PaymentCheckout
                    
</template>

<script>

import { mapState, mapMutations } from "vuex"
import PaymentCheckout from "./PaymentCheckout"
import { fetchPaymentDetails } from "@/common/lib/api";

export default {
  name: "Checkout",

  components: {
    PaymentCheckout
  },

  data: () => ({
    prefillService: {},
    stepperItems: [
      { number: 1, title: "Select Location and Service Category", active: false },
      { number: 2, title: "Select Service", active: false },
      { number: 3, title: "Checkout & Payment", active: true },
      { number: 4, title: "Success", active: false }
    ]  
  }),

  computed: {
    ...mapState({
      dataService: (state) => state.testRequest.products
    })
  },
  

  async created() {
    if (!this.$route.params.id) return

    const data = await fetchPaymentDetails(this.$route.params.id)

    if (data?.status !== "Unpaid") this.$router.push({ name: "customer-payment-history" })

    let durationType = data?.service_info.expected_duration.durationType

    if (durationType === "WorkingDays") {
      durationType = "Days"
    }

    this.prefillService = {
      serviceId: data?.service_id,
      serviceName: data?.service_info.name,
      serviceRate: 0,
      serviceImage: data?.service_info.image,
      serviceCategory: data?.service_info.category,
      serviceDescription: data?.service_info.description,
      labName: data?.lab_info.name,
      labId: data?.seller_id,
      labImage: data?.lab_info.profile_image,
      labRate: 0,
      labAddress: data?.lab_info.address,
      price: (data?.service_info.prices_by_currency[0].total_price).replaceAll(",", ""),
      detailPrice: data?.service_info.prices_by_currency[0],
      currency: data?.service_info.prices_by_currency[0].currency,
      city: data?.lab_info.city,
      country: data?.lab_info.country,
      region: data?.lab_info.region,
      countRateLab: 0,
      countServiceRate: 0,
      duration: data?.service_info.expected_duration.duration,
      durationType,
      verificationStatus: "Verified",
      indexPrice: 0,
      dnaCollectionProcess: data?.service_info.dna_collection_process
    }
    this.setProductsToRequest(this.prefillService)
  },

  methods: {
    ...mapMutations({
      setProductsToRequest: "testRequest/SET_PRODUCTS"
    }),

    handleBack() {
      if (Object.keys(this.prefillService).length) return
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
      height: 100%
      display: flex
      flex-direction: column
      align-items: center

</style>
