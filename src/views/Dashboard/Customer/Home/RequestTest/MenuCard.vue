<template lang="pug">
  .container-card(@click="onClick")
    v-card.menu-card
      v-row.pa-3
        v-col(cols="3")
          ui-debio-avatar(:src="icon" size="90" rounded)
    
        v-col(cols="9")
          .menu-card__title
            .menu-card__name 
              b {{ title }}
            .menu-card__price 
              b {{ formatPrice(price) }} {{ currency.toUpperCase() }}
          
          ui-debio-rating(:rating="rate" :total-reviews="countRate" size="12")

          .menu-card__lab-name
            b {{ labName }}

          .menu-card__address {{ city }}, {{ state }}

</template>

<script>

import { mapState } from "vuex"
import { getStates } from "@/common/lib/api"

export default {
  name: "MenuCard",

  data: () => ({
    state: ""
  }),

  props: {
    title: String,
    icon: String,
    labName: String,
    country: String,
    city: String,
    region: String,
    price: String,
    avatar: String,
    currency: String,
    rate: Number,
    countRate: Number
  },

  computed: {
    ...mapState({
      web3: (state) => state.metamask.web3
    })
  },

  async mounted() {
    await this.getStateData()
  },

  methods: {
    onClick() {
      this.$emit("click")
    },

    async getStateData() {
      const {data: {data}} = await getStates(this.country)
      const states = data
      this.state = states.filter((s) => s.state_code === this.region)[0].name
    },

    formatPrice(price) {
      return this.web3.utils.fromWei(String(price), "ether")
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .container-card
    width: 452px
    height: 117px
    padding: 1px
    border-radius: 8px
    cursor: pointer

    &:hover
      background-color: #FF56E0

  .menu-card 
    border-radius: 8px
    padding: 1px
    width: 450px
    height: 115px

    &__title
      display: flex
      justify-content: space-between
      height:32px

    &__name
      width: 240px
      @include body-text-3-opensans-medium
  
    &__price
      margin-right: 5px
      color: #C400A5
      @include body-text-3-opensans-medium

    &__lab-name
      margin-top: 9px
      width: 240px
      @include body-text-3-opensans-medium

    &__address
      width: 270px
      color: gray
      @include tiny-reg

</style>

