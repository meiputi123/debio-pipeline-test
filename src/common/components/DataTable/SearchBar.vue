<template lang="pug">
  div(class="search-bar")
    v-text-field(
      hide-details="auto"
      class="bri-search-field"
      :class="{ 'has-filter': showFilter }"
      :label="label"
      outlined
      autocomplete="off"
      dense
      append-icon="mdi-magnify"
      color="primary"
      @input="onSearchInput"
      @click="active = true"
    )
    div(
      v-if="showResults"
      class="search-bar__results elevation-5 mt-3 position-absolute rounded"
      v-click-outside="onClickOutside"
    )
      div(
        class="search-bar__item"
        v-for="(item, idx) in filteredItems"
        :key="idx"
        @click="onItemSelected(item)"
      )
        <slot name="item" v-if="$slots.item || $scopedSlots.item" :item="item" :index="idx"></slot>
        <div v-else class="py-2 px-4" v-html="boldString(item[itemText], searchQuery)"></div>

</template>

<script>
import Button from "@/common/components/Button"

export default {
  name: "SearchBar",
  components: {
    Button
  },
  props: {
    filteredItems: { type: Array, default: () => [] },
    itemValue: { type: String, default: "" },
    itemText: { type: String, default: "" },
    label: String,
    withDropdown: Boolean,
    returnObject: Boolean
  },
  computed: {
    showFilter() { // Show filter if filter-menu slot has content
      return !!this.$slots["filter-menu"]
    },

    showResults() {
      return this.withDropdown && this.filteredItems?.length && this.active
    }
  },

  data: () => ({
    active: true,
    searchQuery: ""
  }),

  methods: {
    onClickOutside() {
      this.active = false
    },

    onSearchInput(val) {
      this.active = true
      this.searchQuery = val
      this.$emit("input", val)
    },

    boldString(str, substr) {
      substr = substr.charAt(0).toUpperCase() + substr.slice(1)

      const strRegExp = new RegExp(substr, "g")
      return str.replace(strRegExp, "<b>"+substr+"</b>")
    },

    onItemSelected(item) {
      const selection = this.returnObject
        ? item
        : item[this.itemValue]

      if (!this.itemValue && !this.returnObject) {
        console.error("If you do not set return-object props, please at least set item-value props to return a value")
        return
      }

      this.$emit("itemSelected", selection)
    }
  }
}
</script>

<style lang="sass">
@import '../../styles/variables.scss'

.bri-filter-btn 
  width: 181px
  height: 48px !important
  border: 2px solid #E5E5E6
  background: #F9F9F9 !important
  color: rgba(0, 0, 0, 0.6)
  box-shadow: unset
  letter-spacing: unset !important
  font-size: unset !important
  border-top-right-radius: 0
  border-bottom-right-radius: 0

  span 
    display: flex
    flex-direction: row
    justify-content: space-between
  

  i 
    color: rgba(0, 0, 0, 0.54) !important
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s
  

  &:focus 
    border: 2px solid #3f2040 !important
    i 
      color: #3f2040 !important
    
    &::before 
      background: #F9F9F9 !important
    
  


.bri-search-field 
  width: 100%

  fieldset 
    border: 2px solid #E5E5E6
  
  
  .v-input--is-focused 
    fieldset 
      border: 2px solid #3f2040 !important
    
  
  
  .v-input__append-inner 
    display: flex !important
    height: 30px !important
    align-items: center
    width: 48px
    background-color: #F60689
    margin: 0 !important
    border: 1px solid #F60689
    z-index: 2
    border-bottom-right-radius: 5px
    border-top-right-radius: 5px

    .v-input__icon.v-icon
      font-size: 20px

    i::before
      color: white !important

  .v-input__slot
    background: #F9F9F9 !important
    box-shadow: none !important
    padding-right: 0 !important
    border-radius: 5px
    height: 30px !important
    min-height: 30px !important

    .v-text-field--outlined.v-input--dense .v-label
    top: 2px
    
    .v-label
      line-height: 28px !important
      font-size: 12px
    v-text-field__slot
      height: 32px
      .v-label
        top: 2px

  &.has-filter
    .v-input__slot
      border-bottom-left-radius: 0 !important
      border-top-left-radius: 0 !important
      


.search-bar
  width: 342px
  position: relative

  &__results
    width: 100%
    position: absolute
    z-index: 99
    background: #ffffff


  &__item
    cursor: pointer

    &:not(:last-child)
      margin-bottom: 10px


    &:hover
      background: rgba(0, 0, 0, .1)



</style>
