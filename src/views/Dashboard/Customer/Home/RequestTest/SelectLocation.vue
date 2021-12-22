<template lang="pug">
  .customer-select-location
    .customer-select-location__title Request a Test

    .customer-select-location__form
      RequestTestForm(
        @click="onSubmit"
      )

</template>

<script>
import RequestTestForm from "./RequestTestForm"

export default {
  name: "SelectLocation",

  components: {
    RequestTestForm
  },

  methods: {
    onSubmit() {
      this.$emit("onSubmit")
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-select-location
    width: 100%
    height: 100% 

    &__title
      display: flex
      flex-direction: column
      align-items: center
      margin-top:55px
      @include h6-opensans

    &__form
      width:100%

</style>
