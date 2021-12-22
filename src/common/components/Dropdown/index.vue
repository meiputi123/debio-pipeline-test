<template lang="pug">
  .ui-debio-dropdown(:class="classes" :style="computeStyle" v-click-outside="handleBlur")
    label.ui-debio-dropdown__label(:for="uuid" @click="openOptions" :aria-label="label") {{ label }}
    .ui-debio-dropdown__wrapper(@click="openOptions")
      .ui-debio-dropdown__value-wrapper
        ui-debio-input.ui-debio-dropdown__searchbox(
          :placeholder="computePlaceholder"
          variant="small"
          :value="searchQuery"
          @input="handleSearch"
          @keydown="handleSelectArrow"
          @click="searchFocus = true"
          block
          ref="searchbox"
          :id="uuid"
        )
        label.ui-debio-dropdown__value(v-show="!active" for="searchbox") {{ selectedOption }}
        v-icon(:class="{ 'ui-debio-dropdown__chevron--active': active }") mdi-chevron-down

      .ui-debio-dropdown__selects(:class="{ 'ui-debio-dropdown__selects--show': active }" ref="selects" role="listbox")
        template(v-if="computeItems.length")
          .ui-debio-dropdown__item(
            role="option"
            v-for="(item, idx) in computeItems"
            :key="item.id"
            @mouseover="focusOnItem = null"
            :class="{ 'ui-debio-dropdown__item--selected': item.selected || item.uuid === focusOnItem && !item.selected }"
            :aria-selected="item.selected"
            @click="handleSelectItem(item, item.uuid)"
          )
            template
              slot(name="item" v-if="$slots.item || $scopedSlots.item" :item="item" :index="idx")
              span(v-else) {{ item[itemText] }}
        .ui-debio-dropdown__item.ui-debio-dropdown__item--undefined(v-else)
          | Collections 
          strong.primary--text {{ searchQuery }} 
          | not found
    .ui-debio-input__error-message(v-if="computeErrorMessage") {{ computeErrorMessage }}
</template>

<script>
import { alertIcon } from "@/common/icons"
import { validateInput } from "@/common/lib/validate"
import { generateUUID } from "@/common/lib/utils"

export default {
  name: "UiDebioDropdown",
  mixins: [validateInput],

  props: {
    items: { type: Array, default: () => [] },
    itemValue: { type: String, default: "" },
    width: { type: [String, Number], default: 200 },
    itemText: { type: String, default: "" },
    label: { type: String, default: "Default Label" },
    customLabel: { type: Function, default: () => {} },
    placeholder: { type: String, default: "Select options" },
    value: { type: [String, Number, Boolean, Object, Array], default: null },
    variant: { type: String, default: "default" },

    validateOnBlur: Boolean,
    outlined: Boolean,
    returnObject: Boolean,
    closeOnSelect: Boolean,
    block: Boolean
  },

  data: () => ({
    alertIcon,

    listItems: [],
    searchQuery: "",
    indexer: null,
    focusOnItem: null,
    active: false,
    searchFocus: false
  }),

  computed: {
    classes() {
      return [
        { "ui-debio-dropdown--default": this.variant === "default" },
        { "ui-debio-dropdown--small": this.variant === "small" },
        { "ui-debio-dropdown--large": this.variant === "large" },
        { "ui-debio-dropdown--outlined": this.outlined },
        { "ui-debio-dropdown--active": this.active },
        { "ui-debio-dropdown--errored": (this.isError && this.isError?.length) || (this.error && this.errorMessages) }
      ]
    },

    computeSearchValue() {
      return this.placeholder === this.selectedOption || !this.active && this.closeOnSelect
        ? ""
        : this.selectedOption
    },

    computePlaceholder() {
      const placeholder = this.computeSearchValue || this.placeholder

      return !this.active ? "" : placeholder
    },

    computeItems() {
      const filtered = this.listItems.filter(item => {
        return this.searchQuery.toLowerCase()
          .split(" ")
          .every(v => item[this.itemValue].toLowerCase().includes(v))
      })

      return filtered
    },

    computeStyle() {
      return {
        width: this.block ? "100%" : `${this.width}px`
      }
    },

    selectedOption() {
      return this.value
        ? this.customLabelResult
          ? this.customLabelResult
          : this.value
        : this.placeholder
    }
  },

  watch: {
    selectedOption(newVal) {
      if (this.validateOnBlur && (newVal === this.placeholder) && !this.isError?.length) return
      else this._handleError(newVal)
    },

    error: {
      deep: true,
      immediate: true,
      handler(val, oldVal) {
        if (oldVal) this.isError = null
        if (!val) return

        this._handleError(this.selectedOption)
      }
    },

    active(val) {
      if (val) this.$refs?.searchbox?.$el.querySelector(".ui-debio-input__input").focus()
    },

    items: {
      deep: true,
      immediate: true,
      handler(val) {
        this.listItems = val.map(item => ({
          uuid: generateUUID(),
          ...item,
          selected: false,
          customLabelResult: ""
        }))
      }
    }
  },

  methods: {
    handleSelectItem(selectedItem, uuid) {
      this.indexer = null
      this.focusOnItem = uuid

      this.computeItems.forEach((item) => {
        if (uuid === item?.uuid && item.selected !== true) item.selected = true

        else item.selected = false
      })

      let value = this.returnObject ? selectedItem : selectedItem[this.itemValue]

      if (!selectedItem.selected || value === this.selectedOption) value = null

      if (this.customLabel) this.customLabelResult = this.customLabel(selectedItem)

      if (this.closeOnSelect) {
        this.searchFocus = false
        this.searchQuery = ""
      }

      this.$emit("input", value)
    },

    openOptions() {
      if (this.closeOnSelect && this.active && !this.searchFocus) this.active = false
      else this.active = true
    },

    handleSearch(query) {
      this.active = true

      this.searchQuery = query
    },

    handleSelectArrow(e) {
      const keys = Object.freeze({
        ENTER: 13,
        ARROW_UP: 38,
        ARROW_DOWN: 40
      })

      if (!Object.values(keys).includes(e.keyCode)) return // Allows keys such as enter, arrow up and down

      this.active = true

      const container = this.$refs.selects
      const offsetItem = [...document.getElementsByClassName("ui-debio-dropdown__item--selected")]
        .find(el => el.textContent !== this.selectedOption)?.offsetTop

      if (this.indexer === null) this.indexer = 0

      if (e.keyCode === keys.ARROW_DOWN && this.indexer < (this.computeItems?.length - 1)) {
        this.indexer++
        if (offsetItem > 170) container.scrollTop += 30
      }

      if (e.keyCode === keys.ARROW_UP && this.indexer > 0) {
        this.indexer--
        if (offsetItem < 170) container.scrollTop -= 30
      }

      this.focusOnItem = this.computeItems[this.indexer]?.uuid

      if (this.indexer !== null && e.keyCode === keys.ENTER) {
        this.handleSelectItem(this.computeItems[this.indexer], this.focusOnItem)
      }

      if (this.closeOnSelect && this.active && e.keyCode === keys.ENTER) this.active = false
    },

    _handleError(val) {
      let value = val
      if (value === this.placeholder) value = null
      const error = this.rules.reduce((filtered, rule) => {
        const isError = rule.call(this, value)

        if (typeof isError !== "boolean") filtered.push({ message: isError })

        return filtered
      }, [])
      this.$emit("isError", this.uuid, Boolean(error.length))

      this.isError = error
    },

    async handleBlur(event) {
      if (event?.type !== "click") await new Promise(resolve => setTimeout(resolve, 150))

      this.$nextTick(() => {
        if (this.validateOnBlur && this.active) this._handleError(this.selectedOption)
        this.searchQuery = ""
        this.active = false
        this.searchFocus = false
        if ("blur" in this.$listeners) this.$listeners.blur()
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .ui-debio-dropdown
    &__label
      display: inline-block
      margin-bottom: 0.75rem
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
      display: flex
      align-items: center
      justify-content: space-between
    
    &__wrapper
      background: #FFFFFF
      position: relative
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      border-radius: 0.25rem
      cursor: text
      display: flex
      border: solid 0.125rem transparent
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
      cursor: pointer
      height: 2.5rem
      width: 100%
      padding: 0.875rem 1.125rem
      font-size: 1rem
      color: black

    &__value-wrapper
      display: flex
      justify-content: space-between
      align-items: center
      width: 100%

    &__value
      position: absolute

    &__chevron
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

      &--active
        color: #5640A5 !important
        transform: rotate(180deg)

    &__selects
      position: absolute
      right: 0
      z-index: 20
      width: 100%
      max-height: 12.75rem
      border-radius: 0.25rem
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      background: #FFFFFF
      transform: translateY(-0.625rem)
      opacity: 0
      text-overflow: ellipsis
      visibility: hidden
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
      overflow-y: auto
      overflow-x: hidden
      white-space: nowrap

      &--show
        opacity: 1
        visibility: visible
        transform: translateY(0)

      &::-webkit-scrollbar-track
        background-color: #FFFFFF

      &::-webkit-scrollbar
        width: 0.2rem

      &::-webkit-scrollbar-thumb
        border-radius: 0.625rem
        background: #D3C9D1

    &__item
      position: relative
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
      padding: 0.313rem 1.875rem
      @include body-text-medium-3

      &:first-of-type
        border-radius: 0.25rem 0.25rem 0 0

      &:last-of-type
        border-radius: 0 0 0.25rem 0.25rem

      &:not(.ui-debio-dropdown__item--undefined):hover
        background: #F5F7F9

        &::before
          opacity: 1

      &::before
        content: ""
        display: block
        position: absolute
        opacity: 0
        left: 0
        width: 0.313rem
        height: 100%
        border-radius: 0 0.25rem 0.25rem 0
        background: #C400A5
        top: 50%
        transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
        transform: translateY(-50%)

      &--selected
        background: #F5F7F9
        
        &::before
          opacity: 1

      &--undefined
        text-align: center
        padding: 1rem

    &--disabled
      .ui-debio-dropdown__wrapper
        overflow: hidden
        background: #F5F5F5

    &--active
      .ui-debio-debio__wrapper
        border-color: #5640A5 !important

    &--prepend-icon
      .ui-debio-dropdown__value-wrapper
        margin-left: 1.375rem

    &--append-icon
      .ui-debio-dropdown__value-wrapper
        margin-right: 1.375rem

    &--outlined
      .ui-debio-dropdown__wrapper

        &:not(.ui-debio-dropdown__wrapper--active)
          border-color: #757274
          box-shadow: unset

    &--active
      .ui-debio-dropdown__wrapper
        border-color: #5640A5 !important

      .ui-debio-dropdown__label
        color: #5640A5 !important

      .ui-debio-dropdown__icon > svg
        color: #5640A5 !important

    // Variant
    &--outlined
      .ui-debio-dropdown__wrapper
        border-color: #757274
        box-shadow: unset
      
    &--default
      .ui-debio-dropdown__label
        @include body-text-2

      .ui-debio-dropdown__wrapper
        height: 2.938rem

      .ui-debio-dropdown__selects
        top: 4rem

      .ui-debio-dropdown__value-wrapper
        @include body-text-medium-2

      .ui-debio-input__error-message
        @include body-text-2

    &--small
      .ui-debio-dropdown__label
        @include body-text-4

      .ui-debio-dropdown__wrapper
        height: 2.5rem

      .ui-debio-dropdown__selects
        top: 3.5rem

      .ui-debio-dropdown__value-wrapper
        @include body-text-medium-3

      .ui-debio-input__error-message
        @include body-text-4

    &--large
      .ui-debio-dropdown__label
        @include body-text-1

      .ui-debio-dropdown__wrapper
        height: 3.688rem

      .ui-debio-dropdown__selects
        top: 4.5rem

      .ui-debio-dropdown__value-wrapper
        @include body-text-medium-1

      .ui-debio-input__error-message
        @include body-text-1

    &--errored
      animation: shake .10s cubic-bezier(.7, -0.04, .61, 1.14)

      @keyframes shake
        0%
          transform: translate(-0.25rem, 0)
        50%
          transform: translate(0, 0)
        75%
          transform: translate(-0.25rem, 0)
        90%
          transform: translate(0, 0)
        100%
          transform: translate(-0.25rem, 0)

      .ui-debio-dropdown__wrapper
        border-color: #C400A5 !important

      .ui-debio-dropdown__value-wrapper,
      .ui-debio-dropdown__value-wrapper i
        color: #C400A5 !important

    &::v-deep
      .ui-debio-input
        &__wrapper
          border: unset
          box-shadow: unset
          background: unset

        &__input
          padding: unset
</style>
