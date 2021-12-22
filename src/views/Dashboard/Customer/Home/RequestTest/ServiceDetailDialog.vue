<template lang="pug">
  v-dialog.dialog-service(:value="show" width="440" persistent rounded )
    v-card.dialog-service__card
      div.dialog-service__close
        v-btn.fixed-button(icon @click="closeDialog")
          v-icon mdi-close

      div.dialog-service__service-image
        ui-debio-avatar(:src="selectedService.serviceImage" size="120" rounded)
        
      div.dialog-service__service-name
        .dialog-service__title {{ selectedService.serviceName }}

      div.dialog-service__service-body
        div.dialog-service__service-description
          .dialog-service__sub-title Description
          .dialog-service__description {{ selectedService.serviceDescription }}

        div.dialog-service__service-description
          .dialog-service__sub-title Expected Duration
          .dialog-service__description          
            div {{ selectedService.duration }} {{ selectedService.durationType}}
      
      v-row.dialog-service__lab-detail
        v-col(cols="3")
          ui-debio-avatar.dialog-service__lab-image(:src="selectedService.labImage" size="75" rounded)
        
        v-col(cols="6")
          .dialog-service__sub-title {{ selectedService.labName }}
          .dialog-service__address          
            span {{ selectedService.labAddress }}, {{ selectedService.city }}, {{ country }}

        v-col(cols="3")
          ui-debio-rating(:rating="selectedService.labRate" :total-reviews="selectedService.countRateLab" size="10")

         

      .dialog-service__button
        Button.dialog-service__button-text(
          color="secondary" 
          width="48%"
          height="38" 
          outlined 
          @click="downloadFile"
        ) Download Sample Report

        Button.dialog-service__button-text(
          color="secondary" 
          width="48%"
          height="38" 
          @click="onSelect"
        ) Select This Service

</template>


<script>

import { mapState } from "vuex"
import Button from "@/common/components/Button"
import { downloadDecryptedFromIPFS } from "@/common/lib/ipfs"
import { hexToU8a } from "@polkadot/util"
import { getLocations } from "@/common/lib/api"


export default {
  name: "ServiceDetailDialog",
  
  data: () => ({
    formatedDurationType: "",
    avatar: "",
    countries: []
  }),

  async mounted () {
    await this.getCountries()
  },

  components: {
    Button
  },

  props: {
    show: Boolean
  },

  computed: {
    ...mapState({
      mnemonicData: (state) => state.substrate.mnemonicData,
      selectedService: (state) => state.testRequest.products
    }),

    country () {
      return this.countries.filter((c) => c.iso2 === this.selectedService.country)[0].name
    }
  },

  methods: {

    async getCountries() {
      const { data : { data }} = await getLocations()
      this.countries = data
    },

    closeDialog() {
      this.$emit("close")
    },

    onSelect () {
      this.$router.push({ name: "customer-request-test-checkout"})
    },

    async downloadFile () {
      const publicKey = hexToU8a(this.mnemonicData.publicKey)
      const privateKey = hexToU8a(this.mnemonicData.privateKey)
      const baseUrl = "https://ipfs.io/ipfs/"
      const path = this.downloadPath.replace(baseUrl, "")
      await downloadDecryptedFromIPFS(
        path,
        privateKey,
        publicKey,
        this.serviceId + ".pdf",
        "application/pdf"
      )
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-service
    &__service-image
      display: flex
      justify-content: center
      padding-top: 50px

    &__service-name
      margin-top: 1rem !important
      display: flex
      justify-content: center
      align-content: center

    &__service-body
      margin: 0rem 2.25rem

    &__service-description
      margin-bottom: 1.125rem

    &__title
      display: flex
      align-items: center
      text-align: center
      letter-spacing: 0.0044rem
      margin-bottom: 1.25rem !important
      margin-left: 2.25rem !important
      margin-right: 2.25rem !important
      @include h6-opensans

    &__sub-title
      margin-bottom: 5px
      letter-spacing: -0.0075em
      @include button-2

    &__description
      @include body-text-3-opensans
    
    &__address
      color: gray
      @include body-text-3-opensans

    &__lab-detail
      padding: 10px 30px

    &__button
      margin-top: 15px
      display: flex
      align-items: center
      justify-content: space-between
      padding: 0 35px 40px 35px
      gap: 10px

    &__button-text
      @include body-text-5-opensans

    &__close
      display: flex
      justify-content: flex-end
      padding: 1.013rem !important
    
  .fixed-button
    position: fixed
    width: 50px

      

</style>
