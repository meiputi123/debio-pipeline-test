<template lang="pug">
  .customer-data-bounty
    .customer-data-bounty__wrapper
      ui-debio-banner.customer-data-bounty__banner(
        title="Data Bounty"
        subtitle="Spread medical awareness to the world! store your genetical test result to ocean marketplace as data aggregation, and receive $DBIO reward!"
        gradient-color="secondary"
        with-decoration
      )
        template(slot="illustration")
          ui-debio-icon(
            :icon="researchIllustration"
            :size="cardBlock ? 250 : 180"
            view-box="0 0 170 170"
            fill
          )

      DataTable(:headers="headers" :items="bounties")
        template(slot="prepend")
          .customer-data-bounty__text
            h2.customer-data-bounty__title Data Bounty
            p.customer-data-bounty__subtitle.mb-0 Your data bounty history

        template(v-slot:[`item._source.service_info.name`]="{ item }")
          .customer-data-bounty__item-wrapper
            ui-debio-avatar.customer-data-bounty__item-image(:src="item._source.service_info.image" rounded)
            .customer-data-bounty__item-details
              .customer-data-bounty__item-name {{ item._source.service_info.name }}
              .customer-data-bounty__item-speciment {{ item._source.dna_sample_tracking_id }}

        template(v-slot:[`item._id`]="{ item }")
          .customer-data-bounty__hash.d-flex.align-center
            .customer-data-bounty__item-hash {{ item._id }}
            Button.customer-data-bounty__copy(color="primary" width="60" height="22" @click="handleCopy($event, item._id)") Copy
              
</template>

<script>
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import { fetchBountyLists } from "@/common/lib/api"
import { researchIllustration } from "@/common/icons" 
import { mapState } from "vuex"

export default {
  name: "CustomerDataBounty",

  components: { DataTable, Button },

  data: () => ({
    researchIllustration,

    bounties: [],
    headers: [
      {
        text: "Service Name",
        value: "_source.service_info.name",
        sortable: true
      },
      {
        text: "Lab Name",
        value: "_source.lab_info.name",
        width: "300",
        sortable: true
      },
      {
        text: "Description",
        value: "_source.service_info.description",
        width: "350",
        sortable: true
      },
      {
        text: "Reward",
        value: "reward",
        width: "100",
        sortable: true
      },
      {
        text: "Hashcode",
        value: "_id",
        align: "center",
        sortable: false
      }
    ],
    cardBlock: false
  }),

  computed: {
    ...mapState({
      wallet: (state) => state.substrate.wallet
    })
  },

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  },

  async created() {
    const data = await fetchBountyLists(this.wallet.address)
    this.bounties = data.map(d => ({ ...d, reward: "1 DBIO" }))
  },

  methods: {
    handleCopy(e, hash) {
      e.target.textContent = "Copied"

      this.$nextTick(() => {
        setTimeout(() => {
          e.target.textContent = "Copy"
        }, 1000)
      })

      navigator.clipboard.writeText(hash)
    }    
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-data-bounty
    &__wrapper
      display: flex
      flex-direction: column
      gap: 35px

    &__item-wrapper
      display: flex
      align-items: center
      gap: 15px

    &__item-details
      display: flex
      flex-direction: column
      gap: 2px

    &__item-name
      @include body-text-3-opensans-medium

    &__item-speciment
      color: #8C8C8C
      @include body-text-3-opensans-medium
    
    &__hash
      width: max-content
      gap: 10px
      padding: 2px
      padding-left: 10px
      border-radius: 4px
      background: #EDF2F7

    &__item-hash
      width: 180px
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis

    &__copy
      text-transform: capitalize
      font-size: 10px

    &::v-deep
      .banner__subtitle
        max-width: 29.2rem !important
</style>
