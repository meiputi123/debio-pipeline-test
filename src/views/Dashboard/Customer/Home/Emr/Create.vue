<template lang="pug">
  .customer-create-emr
    ui-debio-modal(
      :show="showLoadingFiles"
      title="File Upload"
      disable-dismiss
      @close="showLoadingFiles = false"
    )
      template(v-if="computeFiles.length")
        .modal-files-upload__wrapper
          .modal-files-upload__files
            .modal-files-upload__file(v-for="{ file, createdAt } in computeFiles" :key="createdAt")
              .modal-files-upload__file-details
                .modal-files-upload__file-name(v-if="file") {{ file.name }}
                .modal-files-upload__file-percent {{ setPercent(file) !== 100 ? `${setPercent(file)}%` : "Complete" }}
              .modal-files-upload__progress
                //- .modal-files-upload__error-message Error, please retry or cancel this file
                .modal-files-upload__progressbar
                  .modal-files-upload__progressbar--thumb(:style="{ width: `${setPercent(file)}%` }")
                .modal-files-upload__status
                  //- .modal-files-upload__progress-check.modal-files-upload__progress-check--failed(
                  //-   role="button"
                  //-   @click="onRetry(file)"
                  //- )
                  .modal-files-upload__progress-check.modal-files-upload__progress-check--cancel(
                    v-if="setPercent(file) !== 100"
                    role="button"
                    @click="onCancel(file)"
                  )
                  .modal-files-upload__progress-check.modal-files-upload__progress-check--success(v-if="setPercent(file) === 100")
      .modal-confirm__cta.d-flex.justify-space-between(slot="cta")
        Button(
          outlined
          width="100"
          color="secondary"
          @click="handleCancelUpload"
        ) Cancel
        Button(
          width="100"
          color="secondary"
          :disabled="disabledFinish"
          @click="onDelete(item.createdAt)"
        ) Finish

    ui-debio-modal(
      :show="showModalPassword"
      title="Encrypt EMR files by input your password"
      disable-dismiss
      @onClose="showModalPassword = false; error = null"
    )
      ui-debio-input(
        :errorMessages="error"
        :rules="$options.rules.password"
        :type="showPassword ? 'text' : 'password'"
        variant="small"
        placeholder="Input Password"
        :disabled="isLoading"
        v-model="password"
        outlined
        block
        :error="!!error"
        validate-on-blur
        @keyup.enter="finalSubmit"
        @blur="error = null"
        @isError="handleError"
      )
        ui-debio-icon(
          slot="icon-append"
          role="button"
          size="18"
          @click="handleShowPassword"
          :icon="showPassword ? eyeIcon : eyeOffIcon"
          stroke
        )

      .modal-password__cta.d-flex(slot="cta")
        Button(
          outlined
          width="100"
          color="secondary"
          :disabled="isLoading"
          @click="showModalPassword = false; error = null"
        ) Cancel

        Button(
          width="100"
          :loading="isLoading"
          color="secondary"
          @click="finalSubmit"
        ) Submit

    ui-debio-modal(
      :show="showModal"
      :title="isEdit ? 'Edit EMR File' : 'Add EMR File'"
      cta-title="Submit"
      :cta-action="handleNewFile"
      :cta-outlined="false"
      @onClose="onCloseModalDocument"
    )
      ui-debio-input(
        :error="isDirty.document && isDirty.document.title"
        :rules="$options.rules.document.title"
        variant="small"
        label="Document Title"
        placeholder="Add Title"
        v-model="document.title"
        outlined
        block
        validate-on-blur
        @isError="handleError"
      )
      ui-debio-textarea(
        :error="isDirty.document && isDirty.document.description"
        :rules="$options.rules.document.description"
        variant="small"
        label="Description"
        placeholder="Add Description"
        v-model="document.description"
        validate-on-blur
        outlined
        block
        @isError="handleError"
      )
      ui-debio-file(
        v-model="document.file"
        :error="isDirty.document && isDirty.document.file"
        :rules="$options.rules.document.file"
        variant="small"
        accept=".pdf"
        label="File input"
        :clearFile="!isEdit && clearFile"
        @isError="handleError"
        validate-on-blur
      )

    .customer-create-emr__wrapper
      .customer-create-emr__title Upload EMR
      .customer-create-emr__forms
        ui-debio-input(
          :rules="$options.rules.emr.title"
          variant="small"
          label="EMR Title"
          :error="isDirty.emr && isDirty.emr.title"
          placeholder="Type EMR Title"
          v-model="emr.title"
          outlined
          block
          validate-on-blur
          @isError="handleError"
        )

        ui-debio-dropdown(
          :items="categories"
          :error="isDirty.emr && isDirty.emr.category"
          :rules="$options.rules.emr.category"
          variant="small"
          label="EMR Category"
          placeholder="Select EMR Category"
          v-model="emr.category"
          item-text="category"
          item-value="category"
          outlined
          close-on-select
          validate-on-blur
          block
          @isError="handleError"
        )

        Button.secondary--text(
          color="secondary"
          height="2.5rem"
          block
          outlined
          @click="handleAddFile"
        ) Add file

        .customer-create-emr__files
          .customer-create-emr__files-title Uploaded Files
          .customer-create-emr__files-items
            .customer-create-emr__file-item.customer-create-emr__file-item--no-file.d-flex.align-center(
              :class="{ 'customer-create-emr__file-item--error': fileEmpty }"
              v-if="!computeFiles.length"
              @click="showModal = true"
            )
              .customer-create-emr__file-details.mt-0
                .customer-create-emr__file-details--left
                  ui-debio-icon.customer-create-emr__file-icon(
                    :icon="fileTextIcon"
                    size="28"
                    color="#D3C9D1"
                    fill
                  )
                  .customer-create-emr__file-name No File uploaded, Please add file to upload

            template(v-else)
              .customer-create-emr__file-item(v-for="(item, idx) in computeFiles" :key="item.createdAt")
                ui-debio-modal.modal-confirm(
                  :show="showModalConfirm === item.createdAt"
                  title="Do you want to delete ?"
                  @onClose="showModalConfirm = null"
                )
                  span.modal-confirm__title By deleting this file, your file will not be uploaded
                  .modal-confirm__cta.d-flex.justify-space-between(slot="cta")
                    Button(
                      outlined
                      width="100"
                      color="secondary"
                      @click="showModalConfirm = null"
                    ) No
                    Button(
                      width="100"
                      color="secondary"
                      @click="onDelete(item.createdAt)"
                    ) Yes

                .customer-create-emr__file-title {{ item.title }}
                .customer-create-emr__file-description {{ item.description }}
                .customer-create-emr__file-details
                  .customer-create-emr__file-details--left
                    ui-debio-icon.customer-create-emr__file-icon(
                      :icon="fileTextIcon"
                      size="28"
                      color="#D3C9D1"
                      fill
                    )
                    .customer-create-emr__file-name(v-if="item.file") {{ item.file.name }}

                  .customer-create-emr__file-details--right
                    ui-debio-icon.customer-create-emr__file-edit(
                      :icon="pencilIcon"
                      size="15"
                      color="#989898"
                      stroke
                      @click="onEdit(item)"
                    )
                    ui-debio-icon.customer-create-emr__file-delete(
                      :icon="trashIcon"
                      size="15"
                      color="#989898"
                      fill
                      @click="showModalConfirm = item.createdAt"
                    )

        Button.white--text(
          color="secondary"
          height="2.5rem"
          @click="handleModalPassword"
          block
        ) Submit
</template>

<script>
import { mapState } from "vuex"

import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import ipfsWorker from "@/common/lib/ipfs/ipfs-worker"
import cryptWorker from "@/common/lib/ipfs/crypt-worker"
import { getEMRCategories } from "@/common/lib/api"
import {
  addElectronicMedicalRecordFile,
  registerElectronicMedicalRecord
} from "@/common/lib/polkadot-provider/command/electronic-medical-record"
import { u8aToHex } from "@polkadot/util"
import { validateForms } from "@/common/lib/validate"
import errorMessage from "@/common/constants/error-messages"
import Button from "@/common/components/Button"
import { fileTextIcon, pencilIcon, trashIcon, eyeOffIcon, eyeIcon } from "@/common/icons"

export default {
  name: "CustomerEmrCreate",

  mixins: [validateForms],

  components: { Button },

  data: () => ({
    errorMessage,
    fileTextIcon,
    pencilIcon,
    trashIcon,
    eyeOffIcon,
    eyeIcon,

    isEdit: false,
    showModal: false,
    showPassword: false,
    showModalConfirm: null,
    showModalPassword: false,
    error: null,
    isLoading: false,
    showLoadingFiles: false,
    fileEmpty: false,
    clearFile: false,
    registerId: null,
    countFileAdded: 0,
    password: "",
    publicKey: null,
    secretKey: null,
    emr: {
      title: "",
      category: "",
      files: []
    },
    document: {
      title: "",
      description: "",
      file: null
    },
    categories: []
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      mnemonicData: (state) => state.substrate.mnemonicData
    }),

    computeFiles() {
      return this.emr.files.map(file => ({ ...file, percent: 0 })).reverse()
    },

    disabledDocumentForm() {
      return this.document.title === "" || this.document.description === "" || this.document.file === null
    },
    
    disabledFinish() {
      return this.computeFiles?.some(file => file.percent !== 100)
    }
  },

  watch: {
    lastEventData(event) {
      if (event !== null) {
        const dataEvent = JSON.parse(event.data.toString())
        if (event.method === "ElectronicMedicalRecordFileAdded") {
          if (dataEvent[1] === this.wallet.address) {
            this.countFileAdded += 1

            if (this.countFileAdded === this.emr.files.length) {
              this.showLoadingFiles = false
              this.registerId = null
              this.resetState()
              this.$router.push({ name: "customer-emr" })
            } else {
              this.handleUpload(this.registerId, this.emr.files[this.countFileAdded], this.countFileAdded)
            }
          }
        } else if (event.method === "ElectronicMedicalRecordAdded") {
          this.isLoading = false
          this.registerId = dataEvent[0].id
          if (dataEvent[0].ownerId === this.wallet.address && this.registerId) {
            this.processFiles(this.registerId)
          }
        }
      }
    },

    mnemonicData(val) {
      if (val) this.initialDataKey()
    }
  },

  rules: {
    password: [ val => !!val || errorMessage.PASSWORD(8) ],
    emr: {
      title: [
        val => !!val || errorMessage.REQUIRED,
        val => val && val.length < 50 || "Max. length 50 Char"
      ],
      category: [ val => !!val || errorMessage.REQUIRED ]
    },
    document: {
      title: [
        val => !!val || errorMessage.REQUIRED,
        val => val && val.length < 50 || "Max. length 50 Char"
      ],
      description: [
        val => !!val || errorMessage.REQUIRED,
        val => val && val.length < 255 || "Max. length 255 Char"
      ],
      file: [
        val => !!val || errorMessage.REQUIRED,
        val => (val && val.size < 2000000) || errorMessage.FILE_SIZE(2),
        val => (val && val.type === "application/pdf") || errorMessage.FILE_FORMAT("PDF")
      ]
    }
  },

  async created() {
    this.fetchCategories()
    if (this.mnemonicData) this.initialDataKey()
  },

  methods: {
    initialDataKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))

      this.publicKey = u8aToHex(cred.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(cred.boxKeyPair.secretKey)
    },

    async fetchCategories() {
      this.categories = await getEMRCategories()
    },

    resetState() {
      Object.assign(this.emr, { title: "", category: "", files: [] })
      Object.assign(this.document, { title: "", description: "", file: null })

      this.password = ""
    },

    getFileIpfsUrl(file) {
      const path = file.ipfsPath[0].data.path
      return `https://ipfs.io/ipfs/${path}`
    },
    
    handleNewFile() {
      this._touchForms("document")
      const { title: docTitle, description: docDescription, file: docFile } = this.isDirty?.document
      if (docTitle || docDescription || docFile) return

      const context = this
      const fr = new FileReader()
      const { createdAt, title, description, file } = this.document

      fr.onload = async function() {
        try {
          const encrypted = await context.encrypt({
            text: fr.result,
            fileType: file.type,
            fileName: file.name
          })

          const { chunks, fileName: encFileName, fileType: encFileType } = encrypted

          if (context.isEdit) {
            const index = context.emr.files.findIndex(file => file.createdAt === createdAt)

            context.emr.files[index] = {
              title,
              description,
              file,
              createdAt: new Date().getTime()
            }

            context.emr.files = context.emr.files.map(file => file)
            context.isEdit = false
          }

          else context.emr.files.push({
            title,
            description,
            file,
            chunks: chunks,
            fileName: encFileName,
            fileType: encFileType,
            createdAt: new Date().getTime()
          })

        } catch(e) {
          this.error = e.message
        }
      }

      fr.readAsArrayBuffer(file)

      this.onCloseModalDocument()
    },
    
    onEdit(item) {
      Object.assign(this.document, { ...item })
      this.showModal = true
      this.isEdit = true
      this.clearFile = false
    },

    handleCancelUpload() {
      this.showLoadingFiles = false
      this.resetState()
    },

    onCloseModalDocument() {
      setTimeout(() => {
        this.isEdit = false
      }, 350)
      this.showModal = false
      Object.assign(this.document, { title: "", description: "", file: null })
      this.clearFile = true
      this._resetForms("document")
    },

    onDelete(id) {
      this.showModalConfirm = null
      this.emr.files = this.emr.files.filter(file => file.createdAt !== id)
    },

    handleAddFile() {
      this.showModal = true
      this.isEdit = false
      this.clearFile = false
    },

    handleModalPassword() {
      this._touchForms("emr")
      const isEMRValid = Object.values(this.isDirty?.emr).every(v => v !== null && v === false)
      const isDocumentValid = Object.values(this.isDirty?.document).every(v => v !== null && v === false)

      if (!isEMRValid || (!isDocumentValid && this.emr.files.length < 1)) {
        if (!this.emr.files.length) this.fileEmpty = true

        return
      }

      this.fileEmpty = false
      this.clearFile = true
      this.showModalPassword = true
    },

    async processFiles(registerId) {
      if (this.emr.files.length > 0) {
        await this.handleUpload(registerId, this.emr.files[0], 0)
      }
    },

    handleShowPassword() {
      this.showPassword = !this.showPassword
    },

    async finalSubmit() {
      this.isLoading = true

      try {
        await this.wallet.decodePkcs8(this.password)

        if (this.emr.files.length > 0) {
          await registerElectronicMedicalRecord(this.api, this.wallet, this.emr)
        }
      } catch (e) {
        this.error = e?.message
        this.isLoading = false
      }
    },

    async handleUpload(id, dataFile, index) {
      this.error = null

      try {
        this.wallet.unlock(this.password)

        const file = dataFile.file
        const context = this
        const fr = new FileReader()
        fr.onload = async function () {
          try {
            // Upload
            const uploaded = await context.upload({
              encryptedFileChunks: dataFile.chunks,
              fileName: dataFile.fileName,
              fileType: dataFile.fileType,
              index: index,
              dataFile: dataFile
            })

            const link = context.getFileIpfsUrl(uploaded)

            const dataBody = {
              id: id,
              title: dataFile.title,
              description: dataFile.description,
              recordLink: link
            }
            await addElectronicMedicalRecordFile(
              context.api,
              context.wallet,
              dataBody
            )
          } catch (err) {
            this.error = err.message
          }
        }

        fr.readAsArrayBuffer(file)

        this.showModalPassword = false
        this.showLoadingFiles = true
      } catch (e) {
        this.error = e?.message
      }
    },

    encrypt({ text, fileType, fileName }) {
      const context = this
      const arrChunks = []
      let chunksAmount
      const pair = {
        secretKey: this.secretKey,
        publicKey: this.publicKey
      }

      return new Promise((resolve, reject) => {
        try {
          cryptWorker.workerEncryptFile.postMessage({ pair, text, fileType }) // Access this object in e.data in worker
          cryptWorker.workerEncryptFile.onmessage = async (event) => {
            if (event.data.chunksAmount) {
              chunksAmount = event.data.chunksAmount
              return
            }

            arrChunks.push(event.data)
            context.encryptProgress = (arrChunks.length / chunksAmount) * 100

            if (arrChunks.length === chunksAmount) {
              resolve({
                fileName: fileName,
                chunks: arrChunks,
                fileType: fileType
              })
            }
          }

          this.fileEmpty = false
        } catch (err) {
          reject(new Error(err.message))
        }
      })
    },

    upload({ encryptedFileChunks, fileName, fileType }) {
      const chunkSize = 10 * 1024 * 1024 // 10 MB
      let offset = 0
      const data = JSON.stringify(encryptedFileChunks)
      const blob = new Blob([data], { type: fileType })
      return new Promise((resolve, reject) => {
        try {
          const fileSize = blob.size
          do {
            let chunk = blob.slice(offset, chunkSize + offset)
            ipfsWorker.workerUpload.postMessage({
              seed: chunk.seed,
              file: blob
            })
            offset += chunkSize
          } while (chunkSize + offset < fileSize)

          let uploadSize = 0
          const uploadedResultChunks = []
          ipfsWorker.workerUpload.onmessage = async (event) => {
            uploadedResultChunks.push(event.data)
            uploadSize += event.data.data.size

            if (uploadSize >= fileSize) {
              resolve({
                fileName: fileName,
                fileType: fileType,
                ipfsPath: uploadedResultChunks
              })
            }
          }
        } catch (err) {
          reject(new Error(err.message))
        }
      })
    },

    setPercent(file) {
      const selected = this.computeFiles.find(v => v.file === file)

      setInterval(() => {
        if (selected && selected.percent < 100) selected.percent += 1
      }, 2000)

      return selected?.percent
    },

    onRetry() {
      // TODO: Add script later
    },

    onCancel() {
      // TODO: Add script later
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-create-emr
    width: 100%
    height: 100%

    &__wrapper
      background: #ffffff
      padding: 50px 0

    &__title
      text-align: center

    &__forms
      display: flex
      flex-direction: column
      gap: 20px
      margin: 0 auto
      max-width: 450px

    &__files
      margin: 10px 0 20px

    &__files-title
      margin-bottom: 20px

    &__files-items
      display: flex
      flex-direction: column
      gap: 20px
      padding-right: .35rem
      max-height: calc(116px * 3)
      overflow-y: auto

      &::-webkit-scrollbar-track
        background-color: #f2f2ff

      &::-webkit-scrollbar
        width: 0.25rem

      &::-webkit-scrollbar-thumb
        border-radius: 0.625rem
        background: #a1a1ff

    &__file-item
      padding: 12px 20px
      border-radius: 4px
      border: 2px dashed #8AC1FF
      background: #F9F9FF
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

      &:hover
        background: #f2f2ff
        border-color: #a1a1ff

      &--no-file
        height: 64px

      &--error
        border-color: #c400a5

        &::v-deep
          .customer-create-emr__file-icon > svg
            color: #c400a5 !important

        .customer-create-emr__file-name
          color: #c400a5

    &__file-title
      font-weight: 600
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
      @include body-text-1

    &__file-name
      max-width: 320px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      @include body-text-5

    &__file-description
      margin-top: 10px
      display: -webkit-box
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical  
      overflow: hidden
      color: #595959
      @include body-text-4

    &__file-details
      margin-top: 12px
      display: flex
      justify-content: space-between

      &--left,
      &--right
        display: flex
        align-items: center
        gap: 10px

    &__file-edit,
    &__file-delete
      cursor: pointer

    &::v-deep
      
      .ui-debio-modal__card-title
        @include h2
        font-weight: 700

  .modal-confirm
    &__title
      width: 212px
      text-align: center

    &__cta
      width: 250px
      margin: 0 auto

  .modal-password
    &__cta
      gap: 20px

  .modal-files-upload
    &__files
      display: flex
      flex-direction: column
      gap: 35px

    &__file-details
      display: flex
      align-items: center
      gap: 115px
      justify-content: space-between

    &__file-name
      @include body-text-medium-2

    &__progress
      display: flex
      align-items: center
      justify-content: space-between
      gap: 15px
      margin-top: 8px

    &__status
      display: flex
      align-items: center
      gap: 8px

    &__file-percent,
    &__error-message
      @include body-text-5

    &__error-message
      color: #F5222D

    &__file-percent
      color: #8C8C8C
      
    &__progress-check
      width: 12px
      height: 12px
      border-radius: 50%

      &--success
        background: linear-gradient(225deg, #76DA92 0%, #61FFF6 100%)

      &--cancel
        background: #757274

      &--failed
        background: #FF525B

    &__progressbar
      width: 100%
      height: 6px
      background: #E7E7E7
      border-radius: 3px

      &--thumb
        width: 0%
        height: 100%
        background: #6FE4AF
        border-radius: inherit
</style>
