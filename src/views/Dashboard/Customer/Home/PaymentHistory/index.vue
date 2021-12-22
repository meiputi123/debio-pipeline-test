<template lang="pug">
  .payment-history
    .payment-history__wrapper
      DataTable(:headers="paymentHeaders" :items="payments")
        template(slot="prepend")
          .payment-history__nav
            .payment-history__nav-text
              h2.payment-history__title Payment History
              p.payment-history__subtitle.mb-0 List of all request test payment
            ui-debio-input.payment-history__search-bar(
              v-model="searchQuery"
              variant="small"
              width="270"
              placeholder="Service Name, Payment Status, Lab Name"
              outlined
              @input="onSearchInput(searchQuery)"
            )
              ui-debio-icon(slot="icon-append" size="20" @click="onSearchInput(searchQuery)" role="button" :icon="searchIcon" stroke)
        template(v-slot:[`item.service_info.name`]="{ item }")
          .payment-history__name-details
            ui-debio-avatar(:src="item.service_info.image" size="41" rounded)
            .payment-history__item-details
              .payment-history__item-name {{ item.service_info.name }}
              .payment-history__item-speciment {{ item.dna_sample_tracking_id }}

        template(v-slot:[`item.service_info.prices_by_currency[0].total_price`]="{ item }")
          .payment-history__price-details
            | {{ formatPrice((item.service_info.prices_by_currency[0].total_price).replaceAll(",", "")) }}
            | {{ item.service_info.prices_by_currency[0].currency }}

        template(v-slot:[`item.reward`]="{ item }")
          span N/A

        template(v-slot:[`item.status`]="{ item }")
          span(:style="{ color: setButtonBackground(item.status) }") {{ item.status }}

        template(v-slot:[`item.actions`]="{ item }")
          Button(
            :color="item.status === 'Unpaid' ? 'secondary' : 'primary'"
            width="80"
            height="25"
            dark
            @click="handleDetails(item)"
            block
          ) {{ item.status === 'Unpaid' ? 'Pay' : 'Details' }}
</template>

<script>
import { mapState } from "vuex"
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import { searchIcon } from "@/common/icons"
import { generalDebounce } from "@/common/lib/utils"
import { fetchPaymentHistories } from "@/common/lib/api";

import metamaskServiceHandler from "@/common/lib/metamask/mixins/metamaskServiceHandler"

export default {
  name: "CustomerPaymentHistory",

  mixins: [metamaskServiceHandler],

  components: { DataTable, Button },

  data: () => ({
    searchIcon,

    searchQuery: "",
    paymentHeaders: [
      { text: "Service Name", value: "service_info.name", sortable: true },
      { text: "Lab Name", value: "lab_info.name", sortable: true },
      { text: "Order Date", value: "created_at", sortable: true },
      { text: "Price", value: "service_info.prices_by_currency[0].total_price", sortable: true },
      { text: "Reward", value: "reward", align: "right", sortable: true },
      { text: "Status", value: "status", align: "right", sortable: true },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "5%"
      }
    ],
    payments: []
  }),

  computed: {
    ...mapState({
      web3: (state) => state.metamask.web3
    })
  },

  watch: {
    searchQuery(newVal, oldVal) {
      if (newVal === "" && oldVal) this.metamaskDispatchAction(this.onSearchInput)
    }
  },

  async created() {
    await this.metamaskDispatchAction(this.onSearchInput)
  },

  methods: {
    onSearchInput: generalDebounce(async function (val) {
      const results = await fetchPaymentHistories(val)
      this.payments = results.map(result => ({
        ...result._source,
        id: result._id,
        created_at: new Date(parseInt(result._source.created_at.replaceAll(",", ""))).toLocaleDateString("id", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }),
        timestamp: parseInt(result._source.created_at)
      }))
    }, 1000),

    setButtonBackground(status) {
      const colors = Object.freeze({
        FULFILLED: "#5640a5",
        PAID: "#5640a5",
        CANCELLED: "#9B1B37",
        REFUNDED: "#595959",
        UNPAID: "#E27625"
      })

      return colors[status.toUpperCase()]
    },

    formatPrice(price) {
      return this.web3.utils.fromWei(String(price.replaceAll(",", "")), "ether")
    },

    handleDetails(item) {
      let id = ""

      if (item.id) id = item.id
      else id = item.orderId

      if (item.status === "Unpaid") this.$router.push({ name: "customer-request-test-checkout", params: { id } })
      else this.$router.push({ name: "customer-payment-details", params: { id } })
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .payment-history
    &__nav
      display: flex
      align-items: center
      justify-content: space-between
    
    &__name-details
      display: flex
      gap: 15px
      align-items: center

    &__item-details
      display: flex
      gap: 8px
      flex-direction: column

    &__item-name
      @include body-text-medium-3

    &__item-speciment
      color: #757274
      @include body-text-4
</style>
