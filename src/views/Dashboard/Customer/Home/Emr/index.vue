<template lang="pug">
.customer-emr
  ui-debio-modal(
    :show="showModal"
    :show-title="false"
    disable-dismiss
  )
    ui-debio-icon(:icon="alertIcon" stroke size="80")
    h1 Delete
    p.modal-password__subtitle(v-if="selectedFile") Are you sure you want to delete {{ selectedFile.title }} EMR files?

    ui-debio-input(
      :rules="$options.rules.password"
      :errorMessages="passwordErrorMessages"
      v-model="password"
      :error="!!error"
      :disabled="isLoading"
      @keyup.enter="onDelete"
      type="password"
      variant="small"
      label="Delete your EMR files by input your password"
      placeholder="Input your password"
      block
      outlined
    )

    .modal-password__cta.d-flex(slot="cta")
      Button(
        outlined
        :disabled="isLoading"
        color="secondary"
        @click="showModal = false; error = null"
      ) Cancel

      Button(
        color="secondary"
        :loading="isLoading"
        :disabled="!password"
        @click="onDelete"
      ) Delete
  ui-debio-banner(
    title="My EMR"
    subtitle="Here, you can upload a collection of your Electronic Medical Records (medical history, diagnoses, medications, treatment plans, immunization dates, allergies, radiology images, and laboratory)."
    gradient-color="primary"
    with-decoration
  )
    template(slot="illustration")
      ui-debio-icon.banner-illustration(:icon="analiticIllustration" :size="cardBlock ? 250 : 180" view-box="0 0 252 252" fill)

  DataTable(
    :headers="headers"
    :loading="isLoading"
    :items="emrDocuments"
  )
    template(slot="prepend")
      .customer-emr__nav
        .customer-emr__nav-text
          h2.customer-emr__title My EMR List
          p.customer-emr__subtitle.mb-0 Your Electronic Medical Records
    template(v-slot:[`item.documentTitle`]="{ item }")
      .d-flex.flex-column
        span(v-for="file in item.files") {{ file.title }}

    template(v-slot:[`item.documentDescription`]="{ item }")
      .d-flex.flex-column
        span(v-for="file in item.files") {{ file.description }}

    template(v-slot:[`item.createdAt`]="{ item }")
      span {{ item.createdAt }}

    template(v-slot:[`item.actions`]="{ item }")
      .customer-emr__actions
        ui-debio-icon(:icon="eyeIcon" size="16" role="button" stroke @click="onDetails(item)")
        ui-debio-icon(:icon="trashIcon" size="16" role="button" stroke @click="handleOpenModalDelete(item)")
</template>

<script>
import { mapState } from "vuex"
import {
  layersIcon,
  analiticIllustration,
  eyeIcon,
  alertIcon,
  trashIcon,
  downloadIcon
} from "@/common/icons"
import {
  deregisterElectronicMedicalRecord
} from "@/common/lib/polkadot-provider/command/electronic-medical-record"

import {
  queryGetEMRList,
  queryElectronicMedicalRecordFileById,
  queryElectronicMedicalRecordById
} from "@/common/lib/polkadot-provider/query/electronic-medical-record"
import errorMessage from "@/common/constants/error-messages"
import { validateForms } from "@/common/lib/validate"
import CryptoJS from "crypto-js"
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"

import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import metamaskServiceHandler from "@/common/lib/metamask/mixins/metamaskServiceHandler"

export default {
  name: "CustomerEmr",
  mixins: [metamaskServiceHandler, validateForms],

  components: { DataTable, Button },

  data: () => ({
    layersIcon,
    analiticIllustration,
    eyeIcon,
    trashIcon,
    downloadIcon,
    alertIcon,

    cardBlock: false,
    showModal: false,
    selectedFile: null,
    showModalPassword: false,
    error: null,
    password: null,
    publicKey: null,
    secretKey: null,
    headers: [
      {
        text: "EMR Title",
        value: "title",
        sortable: true
      },
      {
        text: "Category",
        value: "category",
        sortable: true
      },
      {
        text: "Document Title",
        value: "documentTitle",
        sortable: true
      },
      {
        text: "Description",
        value: "documentDescription",
        sortable: true
      },
      {
        text: "Upload Date",
        value: "createdAt",
        align: "center",
        sortable: true
      },
      {
        text: "Action",
        value: "actions",
        align: "center"
      }
    ],
    emrDocuments: []
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData,
      lastEventData: (state) => state.substrate.lastEventData,
      loadingData: (state) => state.auth.loadingData
    }),

    passwordErrorMessages() {
      return this.errorMessages || this.error
    }
  },

  watch: {
    lastEventData() {
      if (this.lastEventData !== null) {
        const dataEvent = JSON.parse(this.lastEventData.data.toString())

        if (this.lastEventData.method === "ElectronicMedicalRecordRemoved") {
          if (dataEvent[1] === this.wallet.address) this.getEMRHistory()
        }
      }
    },

    mnemonicData(val) {
      if (val) this.initialDataKey()
    }
  },

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  },

  async created() {
    if (this.mnemonicData) this.initialDataKey()
    await this.metamaskDispatchAction(this.getEMRHistory)
  },

  rules: {
    password: [ val => !!val || errorMessage.PASSWORD(8) ]
  },

  methods: {
    initialDataKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))

      this.publicKey = u8aToHex(cred.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(cred.boxKeyPair.secretKey)
    },

    async getEMRHistory() {
      this.emrDocuments = []

      const dataEMR = await this.metamaskDispatchAction(queryGetEMRList, this.api, this.wallet.address)

      if (dataEMR !== null) {
        const listEMR = dataEMR.reduce((filtered, current) => {
          if (filtered.every(v => v !== current)) filtered.push(current)

          return filtered
        }, [])

        if (listEMR.length > 0) {
          listEMR.reverse() // TODO: BAD way, Need reverse from backend
          for (let i = 0; i < listEMR.length; i++) {
            const emrDetail = await this.metamaskDispatchAction(queryElectronicMedicalRecordById,
              this.api,
              listEMR[i]
            )

            if (emrDetail !== null) {
              this.prepareEMRData(emrDetail)
            }
          }

          this.emrDocuments.sort(
            (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
          )
        }
      }
    },

    async prepareEMRData(dataEMR) {
      let files = []

      for (let i = 0; i < dataEMR.files?.length; i++) {
        const file = await this.metamaskDispatchAction(queryElectronicMedicalRecordFileById,
          this.api,
          dataEMR.files[i]
        )

        dataEMR.createdAt = new Date(+file.uploadedAt.replaceAll(",", "")).toLocaleDateString("id", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }),

        files.push({
          ...file,
          createdAt: new Date(+file.uploadedAt.replaceAll(",", "")).toLocaleDateString("id", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }),
          recordLink: file.recordLink.replace("https://ipfs.io/ipfs/", "")})
      }

      const order = {
        id: dataEMR.id,
        title: dataEMR.title,
        category: dataEMR.category,
        createdAt: dataEMR.createdAt,
        files: files?.slice(0, 3)
      }

      this.emrDocuments.push(order)
    },

    onDetails(emr) {
      this.$router.push({ name: "customer-emr-details", params: { id: emr.id, document: emr }})
    },

    handleOpenModalDelete(item) {
      this.selectedFile = item
      this.showModal = true
    },

    async onDelete() {
      const { id } = this.selectedFile

      try {
        await this.wallet.decodePkcs8(this.password)

        await this.metamaskDispatchAction(deregisterElectronicMedicalRecord, this.api, this.wallet, id)
        this.showModal = false
        this.error = null
        this.selectedFile = null
      } catch (e) {
        this.error = e?.message
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .customer-emr
    display: flex
    flex-direction: column
    gap: 30px

    &__actions
      display: flex
      align-items: center
      justify-content: center
      gap: 20px

    &::v-deep
      .banner__subtitle
        max-width: 36.188rem !important

      .ui-debio-modal__card
        gap: 20px

    .modal-password
      &__subtitle
        max-width: 251px
        text-align: center

      &__cta
        gap: 20px
</style>
