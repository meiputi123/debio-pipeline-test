<template lang="pug">
  .customer-test
    modalBounty(
      :show="isShowModalBounty"
      :title="computeModalTitle"
      :sub-title="computeModalSubtitle"
      :link="computeModalLink"
      :loading="modalBountyLoading"
    )
      .modal-bounty__cta.d-flex.mt-8.justify-center
        Button(
          v-if="!!isBountyError"
          color="secondary"
          block
          outlined
          @click="isBountyError = null"
        ) Try again

        Button(
          v-else-if="isSuccessBounty"
          color="secondary"
          width="100"
          outlined
          @click="handleSuccessBounty"
        ) Ok

        template(v-else)
          Button(outlined color="secondary" width="100" @click="isShowModalBounty = false") Cancel
          Button(color="secondary" width="100" @click="downloadFile") Yes

    ui-debio-banner.customer-test__banner(
      title="My Test"
      subtitle="Privacy-first biomedical process. Get your own biomedical sample at home, proceed it anonymously to expert and scientist!"
      with-decoration
      gradientColor="tertiary"
    )
      template(slot="illustration")
        ui-debio-icon(
          :icon="medicalResearchIllustration"
          :size="cardBlock ? 250 : 180"
          view-box="10 0 245 175"
          fill
        )

    .customer-my-test
      .customer-my-test__tabs
        template
          v-tabs(v-model="tabs")
            v-tab Test List
            
            v-tab Stake Service
              
        v-tabs-items(v-model="tabs")
          v-tab-item
            .customer-my-test__table
              DataTable(
                :headers="headers"
                :items="testResult"
              )
                template(class="titleSection" v-slot:[`item.serviceInfo.name`]="{item}")
                  div(class="detailLab d-flex align-center")
                    .customer-my-test__title-detail
                      ui-debio-avatar(
                        :src="item.serviceInfo.image"
                        size="42"
                        rounded
                      )
                    div
                      div.customer-my-test__title-name
                        span {{ item.serviceInfo.name }}
                      div.customer-my-test__title-number
                        span {{ item.dnaSampleTrackingId}}

                template(v-slot:[`item.actions`]="{ item }")
                  .customer-my-test__actions
                    Button(
                      height="25px"
                      width="50%"
                      dark
                      color="primary"
                      :to="{ name: 'order-history-detail', params: item}"
                    ) Details
                    
                    Button(
                      v-if="item.status !== 'ResultReady'"
                      v-show="item.status === 'Registered'"
                      height="25px"
                      width="50%"
                      dark
                      color="secondary"
                      @click="goToInstruction(item.serviceInfo.dnaCollectionProcess)"
                    ) Instruction

                    Button(
                      v-if="item.status !== 'Registered'"
                      v-show="item.status === 'ResultReady'"
                      height="25px"
                      width="50%"
                      dark
                      color="secondary"
                      @click="handleSelectedBounty(item)"
                    ) Add as Bounty

                template(v-slot:[`item.status`]="{item}")
                  .customer-my-test__status
                  span(:style="{color: setStatusColor(item.status)}") {{ item.status.replace(/([A-Z])/g, ' $1').trim() }}
          v-tab-item
            .customer-my-test__table
            StakingServiceTab(
              @unstake="showDialog = true"
            )
            ConfirmationDialog(
              :show="showDialog"
              :loading="isLoading"
              title="Are you sure you want to unstake?"
              message="If you wish to proceed, you won't be able to continue the request service process and no DBIO reward will be given. Your staking amount will be returned after 144 hours or 6 days"
              @click="unstakeService"
              this.isLoding = true
              @close="showDialog=false"
            )
</template>

<script>
import { layersIcon, noteIllustration, medicalResearchIllustration } from "@/common/icons"
import StakingServiceTab from "./StakingServiceTab.vue"
import modalBounty from "./modalBounty.vue"
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import { mapState } from "vuex"
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import localStorage from "@/common/lib/local-storage"
import { u8aToHex } from "@polkadot/util"
import { syncDecryptedFromIPFS } from "@/common/lib/ipfs"
import { createSyncEvent } from "@/common/lib/api"
import { getCategories } from "@/common/lib/api"
import { getOrdersData } from "@/common/lib/polkadot-provider/query/orders"
import { queryLabsById } from "@/common/lib/polkadot-provider/query/labs"
import { queryServicesById } from "@/common/lib/polkadot-provider/query/services"
import {
  COVID_19,
  DRIED_BLOOD,
  URINE_COLLECTION,
  FECAL_COLLECTION,
  SALIVA_COLLECTION,
  BUCCAL_COLLECTION
} from "@/common/constants/instruction-step.js"
import metamaskServiceHandler from "@/common/lib/metamask/mixins/metamaskServiceHandler"
import ConfirmationDialog from "@/common/components/Dialog/ConfirmationDialog"
import { unstakeRequest } from "@/common/lib/polkadot-provider/command/service-request"

import { queryDnaSamples, queryDnaTestResults } from "@/common/lib/polkadot-provider/query/genetic-testing"
import { ordersByCustomer } from "@/common/lib/polkadot-provider/query/orders"

export default {
  name: "MyTest",

  mixins: [metamaskServiceHandler],

  components: {
    StakingServiceTab,
    DataTable,
    Button,
    modalBounty,
    ConfirmationDialog
  },

  data: () => ({
    layersIcon,
    noteIllustration,
    cardBlock: false,
    isSuccessBounty: false,
    isShowModalBounty: false,
    modalBountyLoading: false,
    isBountyError: null,
    selectedBounty: null,
    publicKey: null,
    secretKey: null,
    documents: null,
    tabs: null,
    isProcessed: true,
    isBounty: false,
    isLoading: false,
    orderHistory: [],
    btnLabel: "",
    showDialog: false,
    headers: [
      { text: "Service Name", value: "serviceInfo.name", sortable: true },
      { text: "Lab Name", value: "labInfo.name", sortable: true },
      { text: "Order Date", value: "createdAt", sortable: true },
      { text: "Last Update", value: "updatedAt", sortable: true },
      { text: "Test Status", value: "status", width: "115", sortable: true },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "5%"
      }
    ],
    COVID_19,
    DRIED_BLOOD,
    URINE_COLLECTION,
    FECAL_COLLECTION,
    SALIVA_COLLECTION,
    BUCCAL_COLLECTION,
    medicalResearchIllustration,
    isLoadingOrderHistory: false,
    isLoding: false,
    isLoadingTestResults: false,
    testResult: []
  }),

  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      mnemonicData: (state) => state.substrate.mnemonicData,
      stakingId: (state) => state.lab.stakingId
    }),

    userAddress() {
      return JSON.parse(localStorage.getKeystore()) ["Address"]
    },

    computeModalTitle() {
      const title = this.isSuccessBounty
        ? "Great! Your data has been placed on marketplace successfully!"
        : "Do you want to add your test result as a data bounty?"

      return this.isBountyError ? this.isBountyError : title
    },

    computeModalSubtitle() {
      const subtitle = this.isSuccessBounty
        ? "Congratulations! You get XX $DBIO as reward!"
        : "You can learn more about data bounty by seeing the information"

      return this.isBountyError ? "Something went wrong, please try again" : subtitle
    },

    computeModalLink() {
      return this.isSuccessBounty || this.isBountyError ? null : "/"
    }
  },

  watch: {
    lastEventData(event) {
      if (event === null) return
      const dataEvent = JSON.parse(event.data.toString())
    
      if (event.method === "DataStaked") {
        this.$store.dispatch("substrate/addAnyNotification", {
          address: this.wallet.address,
          dataAdd: {
            message: "Great! Your data has been placed on ocean marketplace successfully! You have recieve xx DBIO",
            data: dataEvent,
            route: "customer-data-bounty",
            params: null
          },
          role: "customer"
        })  
      }

      if(event.method === "Withdraw") {
        this.isLoading = false
        this.showDialog = false
        this.$router.push({
          name: "my-test",
          params: {
            page: 1
          }
        })
      }

      
    },

    mnemonicData(val) {
      if (val) this.initialData()
    }
  },
  async mounted() {
    if (this.$route.params.page) {
      this.tabs = this.$route.params.page
    }
    await this.getTestResultData()
  },
  
  async created() {
    if (this.mnemonicData) await this.initialData()
  },

  methods: {
    async initialData() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))

      this.publicKey = u8aToHex(cred.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(cred.boxKeyPair.secretKey)
    },

    toRequestTest() {
      this.$router.push({ name: "customer-request-test-select-lab"})
    },

    setStatusColor(status) { //change color for each order status
      let colors = Object.freeze({
        REGISTERED: "#6F4CEC",
        PAID: "#44921A",
        UNPAID: "#FAAD15",
        FULFILLED: "#44921A",
        CANCELLED: "#9B1B37",
        FAILED: "#9B1B37",
        RESULTREADY: "#6F4CEC",
        REJECTED: "#9B1B37",
        SUBMITEDASDATABOUNTY: "#5640A5"
      })
      return colors[status.toUpperCase()]
    },

    async getTestResultData(){
      this.isLoadingTestResults = true
      try {
        this.testResult = []
        const address = this.wallet.address
        const orders = await ordersByCustomer(this.api, address)
        if (orders != null) {
          orders.reverse()
          for (let i = 0; i < orders.length; i++) {
            const detailOrder = await getOrdersData(this.api, orders[i])
            const dnaTestResults = await queryDnaTestResults(this.api, detailOrder.dnaSampleTrackingId)
            if (detailOrder.status != "Cancelled" && detailOrder.status != "Unpaid") {
              const dnaSample = await queryDnaSamples(this.api, detailOrder.dnaSampleTrackingId)
              const detailLab = await queryLabsById(this.api, dnaSample.labId)
              const detailService = await queryServicesById(this.api, detailOrder.serviceId)
              this.prepareTestResult(dnaTestResults, detailOrder, dnaSample, detailLab, detailService)
            }
          }
        }
        this.isLoadingTestResults = false
      } catch (error) {
        console.error(error)
        this.isLoadingTestResults = false
      }
    },

    prepareTestResult(dnaTestResults, detailOrder, dnaSample, detailLab, detailService) {
      const feedback = {
        rejectedTitle: dnaSample.rejectedTitle,
        rejectedDescription: dnaSample.rejectedDescription
      }
      const orderId = detailOrder.id
      const title = detailService.info.name
      const description = detailService.info.description
      const serviceImage = detailService.info.image
      const category = detailService.info.category
      const testResultSample = detailService.info.testResultSample 
      const pricesByCurrency = detailService.info.pricesByCurrency 
      const expectedDuration = detailService.info.expectedDuration 
      const serviceId = detailService.id 
      const dnaCollectionProcess = detailService.info.dnaCollectionProcess 
      const serviceInfo = { 
        name: title,
        description: description,
        image: serviceImage,
        category: category,
        testResultSample: testResultSample,
        pricesByCurrency: pricesByCurrency,
        expectedDuration: expectedDuration,
        dnaCollectionProcess: dnaCollectionProcess
      }
      const labName = detailLab.info.name
      const address = detailLab.info.address
      const labImage = detailLab.info.profileImage
      const labId = detailLab.info.boxPublicKey 
      const labInfo = { 
        name: labName,
        address: address,
        profileImage: labImage
      }
      let icon = "mdi-needle";
      if (detailService.info.image != null) {
        icon = detailService.info.image;
      }

      const dateSet = new Date(
        parseInt(dnaSample.createdAt.replace(/,/g, ""))
      )
      const dateUpdate = new Date(
        parseInt(dnaSample.updatedAt.replace(/,/g, ""))
      )
      const timestamp = dateSet.getTime().toString();
      const orderDate = dateSet.toLocaleString("en-GB", {
        weekday: "short", // long, short, narrow
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "short", // numeric, 2-digit, long, short, narrow
        hour: "numeric", // numeric, 2-digit
        minute: "numeric"
      });

      const updatedAt = dateUpdate.toLocaleString("en-GB", { 
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "short" // numeric, 2-digit, long, short, narrow
      })
      const createdAt = dateSet.toLocaleString("en-GB", {
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "short" // numeric, 2-digit, long, short, narrow
      })
      const dnaSampleTrackingId = detailOrder.dnaSampleTrackingId
      const status = dnaSample.status
      
      const result = {
        orderId,
        icon,
        dnaSampleTrackingId,
        timestamp,
        status,
        orderDate,
        serviceId,
        dnaTestResults,
        serviceInfo,
        labId,
        labInfo,
        createdAt,
        updatedAt,
        labName,
        feedback
      }
      this.testResult.push(result)
    },

    checkLastOrder() {
      const status = localStorage.getLocalStorageByName("lastOrderStatus")
      this.isProcessed = status ? status : null
    },

    goToInstruction(item) {
      if (item == "Covid 19 Saliva Test") {
        window.open(this.COVID_19, "_blank")
      }
      if (item == "Blood Cells - Dried Blood Spot Collection Process") {
        window.open(this.DRIED_BLOOD, "_blank")
      }
      if (item == "Epithelial Cells - Buccal Swab Collection Process") {
        window.open(this.BUCCAL_COLLECTION, "_blank")
      }
      if (item == "Fecal Matters - Stool Collection Process") {
        window.open(this.FECAL_COLLECTION, "_blank")
      }
      if (item == "Saliva - Saliva Collection Process") {
        window.open(this.SALIVA_COLLECTION, "_blank")
      }
      if (item == "Urine - Clean Catch Urine Collection Process") {
        window.open(this.URINE_COLLECTION, "_blank")
      }
    },

    async handleSelectedBounty(val) {
      this.selectedBounty = { ...val.dnaTestResults, ...val }
      this.isShowModalBounty = true
    },

    handleSuccessBounty() {
      this.isShowModalBounty = false

      setTimeout(() => {
        this.isSuccessBounty = false
      }, 350)
    },

    async downloadFile() {
      if (!this.selectedBounty) return

      this.modalBountyLoading = true
      try {
        const pair = {
          secretKey: this.secretKey,
          publicKey: this.publicKey
        }

        await syncDecryptedFromIPFS(
          this.selectedBounty.resultLink.replace("https://ipfs.io/ipfs/",""),
          pair,
          `${this.selectedBounty?.trackingId}.vcf`,
          "text/vCard"
        )

        const serviceCategories = await getCategories()
        const service = serviceCategories.find(
          service => service.name === this.selectedBounty.serviceInfo.category
        )

        await createSyncEvent({
          orderId: this.selectedBounty?.orderId,
          serviceCategoryId: service.id,
          fileName: `${this.selectedBounty?.trackingId}.vcf`
        })

        this.selectedBounty = null
        this.isSuccessBounty = true
        this.modalBountyLoading = false
      } catch (e) {
        this.isBountyError = e?.message
        this.modalBountyLoading = false
      }
    },

    cancelBounty() {
      this.isBounty = false
    },

    async unstakeService () {
      const requestId = this.stakingId
      this.isLoading = true
      await unstakeRequest(this.api, this.wallet, requestId)
      
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"


  .customer-test
    &::v-deep
      .banner__subtitle
        max-width: 36.188rem !important
        @include text-h2-banner

  .customer-my-test
    width: 100%
    background: #FFFFFF
    margin-top: 30px

    &__tabs
      padding: 3px 20px

    &__table
      padding: 0px

    &__actions
      padding: 35px
      display: flex
      align-items: center
      gap: 30px
      margin: 5px

    &__status
      color: #48A868

    &__title-detail
      margin: 0 5px 0 0
      border-radius: 5px
    
    &__title-number
        color: #8C8C8C

  .modal-bounty__cta
    gap: 40px
    .customer-test
      &::v-deep

  .degenics-datatable-card
    padding: 0 !important
    margin: -24px 0 0 0
    
  .degenics-data-table
    margin-top: 0px !important
</style>
