<template lang="pug">
  .customer-create-emr__upload
    .emr-upload
      ui-debio-dropdown(
        :value="document.category"
        :rules="$options.rules.document.category"
        :items="categories"
        :errorMessages="errorMessages"
        variant="small"
        label="Select Category"
        return-object
        placeholder="Select Category"
        close-on-select
        item-text="name"
        item-value="name"
        @isError="handleError"
        outlined
        block
        @input="handleSelected"
      )
        template(v-slot:item="{ item }")
          span {{ item.icon }} {{ item.name }}
      ui-debio-input(
        :errorMessages="errorMessages"
        :rules="$options.rules.document.title"
        v-model="document.title"
        variant="small"
        label="Title"
        placeholder="Add Document Title"
        @isError="handleError"
        block
        outlined
        validate-on-blur
      )
      ui-debio-textarea(
        :rules="$options.rules.document.description"
        :errorMessages="errorMessages"
        v-model="document.description"
        variant="small"
        label="Description"
        placeholder="Add Description"
        block
        @isError="handleError"
        outlined
      )
      ui-debio-file(
        v-model="document.file"
        :errorMessages="errorMessages"
        :rules="$options.rules.document.file"
        variant="small"
        accept=".pdf"
        label="File input"
        @isError="handleError"
      )
</template>

<script>
import { validateForms } from "@/common/lib/validate"
import errorMessage from "@/common/constants/error-messages"

export default {
  name: "CustomerEmrUpload",
  mixins: [validateForms],

  data: () => ({
    errorMessage,

    document: {
      title: "",
      description: "",
      category: null,
      file: null
    },
    categories: [
      { name: "Allergies and adverse drug reactions" },
      { name: "Chronic diseases" },
      { name: "Family medical history" },
      { name: "Illnesses and hospitalizations" },
      { name: "Imaging reports (e.g. X-ray)" },
      { name: "Laboratory test results" },
      { name: "Medications and dosing" },
      { name: "Prescription record" },
      { name: "Surgeries and other procedures" },
      { name: "Vaccinations" },
      { name: "Observations of daily living (ODLs)" },
      { name: "Others" }
    ]
  }),

  rules: {
    document: {
      title: [ val => !!val || errorMessage.REQUIRED ],
      category: [ val => !!val || errorMessage.REQUIRED ],
      description: [ val => !!val || errorMessage.REQUIRED ],
      file: [
        val => !!val || errorMessage.REQUIRED,
        val => (val && val.size < 30000000) || errorMessage.FILE_SIZE(30),
        val => (val && val.type === "application/pdf") || errorMessage.FILE_FORMAT("PDF")
      ]
    }
  },

  watch: {
    computeError(state) {
      const payload = state ? null : this.document

      this.$emit("uploadFulfilled", payload)
      this.$emit("uploadFormError", { step: 1, status: state })
    },

    document: {
      deep: true,
      immediate: true,
      handler(payload) {
        if (this.computeError) this.$emit("uploadFulfilled", payload)
      }
    }
  },

  methods: {
    handleSelected(val) {
      this.document.category = val?.name || null
    }
  }
}
</script>

<style lang="sass">
  .emr-upload
    width: 100%
    display: flex
    flex-direction: column
    align-items: center
    gap: 2.063rem
</style>
