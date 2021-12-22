<template lang="pug">
  v-card.no-lab-card
    div.card-title Oops!
    div.card-sub-title There are no available labs provide this service in your area.
    div.card-body 
      div 1. There's no locking period. Your fund can be unstaked anytime with your consent but there will be a period of 6 days to process it.
      div 2. Upon receiving your test result, you will be rewarded with DBIO as a token of gratitude for using our service. By unstaking your fund, you will lose this privilege.
      div 3. You will receive notification when requested service is available. You can proceed to request a test. If the staked amount is bigger than the service price, you will get refund for overpayment. If staked amount is smaller than the service price, to complete the purchase, you should pay for the outstanding amount to complete the purchase.

    v-row(class="d-flex justify-center mt-16")
      Button.mt-5.mb-10(
        color="secondary" 
        width="560"
        height="38"
        @click="showingAgreementDialog"
        ) Request a service

    template
      AgreementDialog(
        :show="showAgreement"
        @close="closingDialog"
        @click="onClickDialogButton"
      )

    template
      Dialog(
        :show="showSuccessDialog"
        :width="289"
        title="Request service submitted!"
        message="Thanks for submitting request service! We are trying our best to find the nearest lab available. You can monitor your request here"
        btn-message="ok"
        @close="closingDialog"
        @click="toStakeService"
        )
  
</template>

<script>
import { mapState } from "vuex"
import AgreementDialog from "./AgreementDialog.vue"
import Dialog from "@/common/components/Dialog"
import Button from "@/common/components/Button"


export default {
  name: "NoLab",

  components: {
    Dialog,
    AgreementDialog,
    Button
  },

  data: () => ({
    showAgreement: false,
    showSuccessDialog: false
  }),

  computed: {
    ...mapState({
      country: (state) => state.lab.country,
      city: (state) => state.lab.city,
      category: (state) => state.lab.category,
      labs: (state) => state.lab.labs
    })
  },

  async mounted () {
    if (!this.labs.length) this.showNoLab = true
  },

  methods: {
    showingAgreementDialog () {
      this.showAgreement = true
    },

    closingDialog() {
      this.showAgreement = false
    },

    onClickDialogButton() {
      this.showAgreement = false
      this.showSuccessDialog = true
    },

    toStakeService () {
      this.$router.push({ 
        name: "my-test",
        params: {
          page: 1
        }
      })
    }
  }

}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .card-no-lab
    display: flex
    flex-direction: column
    align-items: center  

  .card-title 
    @include body-text-2

  .card-sub-title 
    margin-bottom: 2%
    margin-top: 2%
    color:#F92020
    @include body-text-2

  .card-body 
    @include body-text-3
    
  .no-lab-card 
    padding: 5%
    margin: 4%
    border-radius: 4

</style>
