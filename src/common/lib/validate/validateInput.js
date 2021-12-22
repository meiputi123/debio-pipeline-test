import { generateUUID } from "@/common/lib/utils"

export default {
  props: {
    errorMessages: { type: String, default: null },
    rules: { type: Array, default: () => [] },

    error: Boolean
  },

  data: () => ({ isError: null, uuid: null }),

  computed: {
    computeErrorMessage() {
      const message = this.isError || this.errorMessages

      return message && message[0]?.message ? message[0]?.message : ""
    }
  },

  created() {
    this.uuid = generateUUID()
    if (this.rules?.length) this.$emit("isError", this.uuid, true)
  }
}
