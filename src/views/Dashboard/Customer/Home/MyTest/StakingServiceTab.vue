<template lang="pug">
  DataTable(
    :headers="headers"
    :items="items"
  )
    template(v-slot:[`item.country`]="{ item }")
      div {{ country(item.request.country) }}

    template(v-slot:[`item.city`]="{ item }")
      div {{ item.request.city }}

    template(v-slot:[`item.category`]="{ item }")
      div {{ item.request.service_category }}

    template(v-slot:[`item.stakingDate`]="{ item }")
      span {{ formatDate(item.request.created_at) }}

    template(v-slot:[`item.stakeStatus`]="{ item }")
      span(:style="setButtonBackground(item.request.status)") {{ getStatusName(item.request.status) }} 

    template(v-slot:[`item.amount`]="{ item }")
      span(:style="setButtonBackground(item.request.status)") {{ setAmount(item.request.staking_amount) }}

    template(v-slot:[`item.actions`]="{ item }")
      .customer-staking-tab__actions(v-if="item.request.status !== 'WaitingForUnstaked'" )
        Button.pa-4(
          height="25px"
          width="100px"
          style="font-size: 1em"
          color="primary"
          @click="getUnstakingDialog(item.request.hash)"
          :disabled="item.request.status === 'Unstaked' || item.request.status === 'Processed'"
        ) Unstake

        Button.pa-4(
          v-if="item.request.status === 'Open' || item.request.status === 'Claimed'" 
          height="25px"
          style="font-size: 1em"
          width="100px"
          color="secondary"
          @click="toRequestTest(item)"
          :disabled="item.request.status === 'Open'"
        ) Proceed

      .customer-staking-tab__actions(v-else)
        Button.pa-4(
          style="font-size: 1em"
          height="25px"
          width="100px"
          color="#F5F5F5"
            ) {{ setRemainingStakingDate(item.request.unstaked_at) }}

</template>

<script>

import { mapState, mapMutations } from "vuex"
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import stakingStatus from "@/common/constants/staking-status"
import ConfirmationDialog from "@/common/components/Dialog/ConfirmationDialog"
import { getServiceRequestByCustomer } from "@/common/lib/api"
import { getLocations } from "@/common/lib/api"


export default {
  name: "StakingServiceTab",

  components: {
    DataTable,
    Button,
    ConfirmationDialog
  },

  data: () => ({
    status: "",
    headers: [
      {
        text: "Country",
        value: "country",
        sortable: true
      },
      {
        text: "City",
        value: "city",
        sortable: true
      },
      {
        text: "Service Category",
        value: "category",
        sortable: true
      },
      {
        text: "Staking Date",
        value: "stakingDate",
        sortable: true
      },
      {
        text: "Stake Status",
        value: "stakeStatus",
        sortable: true
      },
      {
        text: "Amount (DBIO)",
        value: "amount",
        sortable: true,
        align: "right"
      },
      {
        text: "Action",
        value: "actions",
        sortable: false,
        align: "center"
      }
    ],
    items: [],
    documents: null,
    tabs: null,
    showDialog: false,
    requestId: "",
    countries: []
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      pair: (state) => state.substrate.wallet,
      web3: (state) => state.metamask.web3
    })
  },

  async mounted () {
    await this.fetchData ()
    await this.getCountries()
  },

  methods: {
    ...mapMutations({
      setCategory: "lab/SET_CATEGORY",
      setStakingService: "lab/SET_STAKING_SERVICE",
      setStakingId: "lab/SET_STAKING_ID"
    }),

    async fetchData () {
      const { data } = await getServiceRequestByCustomer(this.pair.address)
      this.items = data
    },

    setAmount(amount) {
      const formatedAmount = this.web3.utils.fromWei(String(amount.replaceAll(",", "")), "ether")
      return formatedAmount
    },

    async getCountries() {
      const { data : { data }} = await getLocations()
      this.countries = data
    },

    country (country) {
      return this.countries.filter((c) => c.iso2 === country)[0].name
    },

    setRemainingStakingDate(date) {
      const formatedDate = new Date(parseInt(date.replace(/,/g, "")))
      const dueDate = formatedDate.setDate(formatedDate.getDate() + 7)
      const now = new Date().getTime()
      const distance = dueDate - now

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      return `${days}D:${hours}H:${minutes}M`      
    },

    async toRequestTest(service) {
      const request = service.request
      const country = request.country
      const region = request.region
      const city = request.city
      const category = request.service_category
      const status = "StakingRequestService"
      this.setStakingService(request)
      this.setCategory(category)
      await this.$store.dispatch("lab/setCountryRegionCity", {country, region, city})
      await this.$store.dispatch("lab/getServicesByCategory", {category, status})
      
      this.$router.push({ name: "customer-request-test-service"})
    },

    getUnstakingDialog(id) {
      this.setStakingId(id)
      this.$emit("unstake")

      this.requestId = id
    },

    setButtonBackground(status) {
      const colors = Object.freeze({
        "OPEN": "#F60689",
        "CLAIMED": "#5640A5",
        "PROCESSED": "#4CBB65",
        "WAITINGFORUNSTAKED": "#FAAD15",
        "UNSTAKED": "#E32319"
      })

      return { color: colors[status.toUpperCase()] }
    },

    getStatusName(status) {
      for (const key in stakingStatus) {
        if (key === status.toUpperCase()) return stakingStatus[key]
      }
    },

    formatDate(date) {
      const formattedDate = new Date(parseInt(date.replace(/,/g, ""))).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
      })
      return formattedDate
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-staking-tab
    width: 100%
    height: 100%
    background: #FFFFFF

    &__tabs
      padding: 2px

    &__table
      width: 100%
      padding: 0px 30px

    &__actions
      padding: 0 10px
      align-content: center
      margin: 0 10%
      display: flex
      align-items: center
      gap: 20px
</style>
