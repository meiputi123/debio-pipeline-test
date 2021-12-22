<template lang="pug">
  .dialog-error
    v-dialog(:value="show" width="400" persistent)
      v-card(height="500")
        v-app-bar(flat dense color="white")
          v-spacer
          v-btn( class="mt-2" icon @click="closeDialog")
            v-icon mdi-close

        v-card-text(align="center")

          div(class="d-flex justify-center pa-4 mb-6")
            b.dialog-error__title {{ title }}

          div(class="d-flex justify-center pb-5 pt-2")
            v-img(v-bind:src="require('@/assets/alert-triangle.png')" max-width="87.07")
            
          div(class="d-flex justify-center pa-4")
            .dialog-error__desc {{ message }}

          div(class="d-flex justify-center pa-5 mt-8")
            Button(
              style="font-size: 10px"
              color="secondary" 
              width="170"
              height="35"
              @click="closeDialog"
              ) Dismis
</template>

<script>
import Button from "@/common/components/Button"

export default {
  name: "ErrorDialog",

  components: {
    Button
  },

  props: {
    show: Boolean,
    title: String,
    message: String
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-error
    &__title
      @include h6-opensans

    &__desc
      @include body-text-2
</style>
