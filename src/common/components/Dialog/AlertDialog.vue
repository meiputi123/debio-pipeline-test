<template lang="pug">
  .dialog-alert
    v-dialog(:value="show" height="335" width="299"
    persistent)
      v-card
        v-app-bar(flat dense color="white")
        v-card-text(align="center")
          div(class="d-flex justify-center pb-5 pt-2")
            v-img(v-bind:src="require('@/assets/'+imgPath)" max-width="66")

          div(class="d-flex justify-center pa-3")
            b.dialog-alert__title Unable to Continue
          
          div(class="d-flex justify-center pa-1")
            b.dialog-alert__desc Complete your unpaid order first before requesting a new one. 


          div(class="d-flex justify-center pa-5")
            Button(
              style="font-size: 10px"
              color="secondary" 
              width="auto"
              height="38"
              @click="onSubmit"
              ) {{ btnMessage}}
      
</template>

<script>
import Button from "@/common/components/Button"

export default {
  name: "AlertDialog",

  components: {
    Button
  },

  props: {
    show: Boolean,
    width: Number,
    message:String,
    imgPath: String,
    btnMessage: String
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

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-alert
    &__title
      @include body-text-1

    &__desc
      @include body-text-medium-2
</style>
