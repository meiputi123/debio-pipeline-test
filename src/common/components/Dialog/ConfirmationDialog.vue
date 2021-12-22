<template lang="pug">
  v-dialog(:value="show" height="400" width="400" persistent)
    v-card
      v-app-bar(flat dense color="white")
        v-toolbar-title(class="title d-flex justify-end align-center" style="width: 100%;")
          v-btn(icon @click="closeDialog")
            v-icon(style="font-size: 20px;") mdi-close
        v-spacer
      
      div(class="text-h5 pa-5" align="center") {{ title }}
      v-card-text(class="pa-5" align="center") {{ message}}

        div(class="d-flex justify-space-between pa-10" style="gap: 5px")
          Button(
            color="secondary" 
            width="120px"
            height="35px"
            outlined
            @click="closeDialog"
          ) No

          Button(
            color="secondary" 
            width="120px"
            height="35px"
            @click="onSubmit"
          ) Yes
  
      v-progress-linear(
        v-if="loading"
        indeterminate
        color="primary"
      )
      
</template>

<script>
import Button from "@/common/components/Button"

export default {
  name: "ConfirmationDialog",

  components: {
    Button
  },

  props: {
    show: Boolean,
    message:String,
    title: String,
    loading:Boolean
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    },

    onSubmit() {
      this.$emit("click")
    }
  }
}
</script>
