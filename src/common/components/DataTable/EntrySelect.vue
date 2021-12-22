<template lang="pug">
  div.box
    div.num-of-entries-select
      v-select(
        hide-details="auto"
        :items="numOfEntrieSlect"
        v-model="numOfEntries"
        color=""
        outlined
        dense
      )
</template>

<script>
export default {
  props: {
    value: {type: [Number, String]}
  },
  data:() => ({
    numOfEntrieSlect: [5, 10, 15, 20]
  }),
  computed: {
    numOfEntries: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("select", val)
      }
    }
  }
}
</script>

<style lang="sass">
.box
  margin: -3px 5px 0px 5px
.v-text-field.v-text-field--solo .v-input__control
  min-height: 24px

.num-of-entries-select
  fieldset
    border: 2px solid $color-border

  .v-input--is-focused
    fieldset
      border: 2px solid $color-secondary !important



  .v-input
    width: 66px 

  .v-input__slot
    background: $color-form-background !important
    box-shadow: none !important
    height: 23px !important
    min-height: 23px !important

    .v-select__selections
      overflow: visible
      font-size: 12px
      margin: 6px 4px 7px 0 !important


  .v-input__append-inner
    width: 20px
    margin-top: 12px !important
    
    .v-input__icon
      height: 2px



</style>
