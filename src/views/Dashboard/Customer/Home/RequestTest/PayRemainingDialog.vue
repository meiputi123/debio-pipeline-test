<template lang="pug">
  v-dialog(:value="show" width="480" persistent rounded )
    v-card
      v-app-bar(flat dense color="white" )
        v-toolbar-title(class="title mt-8" v-if="agreement") Pay remaining amount
        v-spacer
        v-btn( class="mt-8" icon @click="closeDialog")
          v-icon mdi-close
      v-card(class="ms-4 me-4" style="background-color: #F5F7F9; font-family: Raleway ")
        v-card-text(class="mb-4 mt-10")
          div(style="font-size: 12px" class="me-3" )
            div 1. By clicking Pay button you will use your balance to pay the remaining amount that needed to be completed.
            div 2. The remaining amount calculated in payment details.
            div 3. If your balance is not enough to pay the remaining amount, you can top up your balance first and go back to this page.

      v-card-text(class="mt-4 pb-0 text-subtitle-1")
        div(class="text-body-1 mt-10")
          div.mb-3 Remaining Amount
            v-row
              v-col(
                cols="12"
                sm="9"
              )
                v-text-field(
                  :placeholder="amount"
                  outlined
                  disabled 
                )
              
              v-col(
                cols="12"
                sm="3"
              )
                v-text-field(
                  placeholder="DBIO"
                  outlined
                )

        v-checkbox(class="mt-5")
          template(v-slot:label)
            b I have read and agree to the <a> terms and conditions </a>

      v-card-actions(class="px-6 pb-4")
        v-btn(
          depressed
          color="secondary"
          large
          width="100%"
          @click="onSubmit"
          :loading="isLoading"
        ) Continue

</template>

<script>
import { mapState } from "vuex"
import { startApp } from "@/common/lib/metamask"
import { getBalanceETH } from "@/common/lib/metamask/wallet.js"
import { lastOrderByCustomer, getOrdersData } from "@/common/lib/polkadot-provider/query/orders.js"
import { ethAddressByAccountId } from "@/common/lib/polkadot-provider/query/user-profile.js"
import { createOrder } from "@/common/lib/polkadot-provider/command/orders.js"
import { processRequest } from "@/common/lib/polkadot-provider/command/service-request"
import localStorage from "@/common/lib/local-storage"
import CryptoJS from "crypto-js"	
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"

export default {
  name: "PayRemainingDialog",

  props: {
    show: Boolean,
    amount: Number
  },

  data: () => ({
    currencyType: "DBIO",
    agree: false,
    dialogAlert: false,
    isLoading: false,
    transactionStep: "",
    agreement: true,
    error: "",
    password: ""
  }),
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      pair: (state) => state.substrate.wallet,
      country: state => state.lab.country,
      region: state => state.lab.region,
      city: state => state.lab.city,
      category: state => state.lab.category,
      stakingData: (state) => state.lab.stakingData,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
      selectedService: (state) => state.testRequest.products
      
    })
  },
  
  methods: {
    closeDialog() {
      this.$emit("close")
    },

    async onSubmit() {
      this.isLoading = true
      this.error = ""

      this.ethAccount = await startApp()
      if (this.ethAccount.currentAccount === "no_install") {
        this.isLoading = false
        this.error = "Please install MetaMask!"
        return
      }

      // cek kalo udah binding wallet
      if (!this.metamaskWalletAddress) {
        this.isLoading = false
        this.password = ""
        this.error = "Metamask has no address ETH."
        return
      }

      // check ETH Balance
      const balance = await getBalanceETH(this.metamaskWalletAddress)
      if (balance <= 0 ) {
        this.isLoading = false
        this.password = ""
        this.error = "ETH balance is 0"
        return
      }

      // Seller has no ETH address
      this.ethSellerAddress = await ethAddressByAccountId(
        this.api,
        this.stakingData.lab_address
      )

      if (this.ethSellerAddress === null) {
        this.isLoading = false
        this.password = ""
        this.error = "The seller has no ETH Address."
        return
      }

      const mnemonic = localStorage.getLocalStorageByName("mnemonic_data")
      const decryptedMnemonic = CryptoJS.AES.decrypt(mnemonic, "cocacola").toString(CryptoJS.enc.Utf8)
      const identity = await Kilt.Identity.buildFromMnemonic(decryptedMnemonic)
      const customerBoxPublicKey = u8aToHex(identity.boxKeyPair.publicKey)
      const serviceFlow = "StakingRequestService"
      await createOrder(
        this.api,
        this.pair,
        this.selectedService.serviceId,
        customerBoxPublicKey,
        serviceFlow,
        this.selectedService.indexPrice,
        this.processService
      )
      this.$router.push({ name: "customer-request-test-success"})
    },

    async processService () {
      this.lastOrder = await lastOrderByCustomer(
        this.api,
        this.pair.address
      )
      this.detailOrder = await getOrdersData(this.api, this.lastOrder)
      const orderId = this.detailOrder.id
      const dnaSampleTrackingId = this.detailOrder.dnaSampleTrackingId
      const additional = this.detailOrder.additionalPrices

      await processRequest(
        this.api,
        this.pair,
        this.stakingData.lab_address,
        this.stakingData.hash,
        orderId,
        dnaSampleTrackingId,
        additional
      )
      this.isLoading = false
    }
  }
}
</script>
