<template lang="pug">
  .ui-debio-stepper
    .ui-debio-stepper__wrapper
      ul.ui-debio-stepper__items
        li.ui-debio-stepper__item(
          v-for="(stepper, idx) in items"
          aria-current="step"
          :aria-selected="stepper.active"
          :key="stepper.number"
          :class="computeClasses[idx]"
        )
          .ui-debio-stepper__number(:aria-label="stepper.number") {{ stepper.number }}
          .ui-debio-stepper__title(:aria-label="stepper.title") {{ stepper.title }}
</template>

<script>
export default {
  name: "UiDebioStepper",
  props: {
    items: {
      type: Array,
      default: () => [],
      validator: val => {
        const allowedKeys = ["number", "title", "active"]

        return val.every(v => Object.keys(v).every(k => allowedKeys.includes(k)))
      }
    },
    withLineIndicator: { type: Boolean, default: false }
  },

  computed: {
    computeClasses() {
      return this.items.map(item => {
        return {
          "ui-debio-stepper__item--active": item.active,
          "ui-debio-stepper__item--active-line": this.withLineIndicator && item.active 
        } 
      })
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .ui-debio-stepper
    &__wrapper
      width: 100%

    &__items
      display: flex
      gap: 0 11.25rem
      min-width: fit-content
      padding: 0 !important

    &__item
      display: flex
      flex-direction: column
      align-items: center
      position: relative

      &--active
        .ui-debio-stepper__number
          background: #5640A5
          color: #FFFFFF
          animation: scale .3s cubic-bezier(.7,-0.04,.61,1.14)

      &--active-line
        &::before
          background: #5640A5 !important

      &:not(:first-of-type)
        &::before
          content: ""
          display: block
          position: absolute
          top: 25%
          right: 52%
          min-width: calc(100% + (4 * 3.2rem))
          height: 0.188rem
          background: #F5F7F9
          transition: all cubic-bezier(.7,-0.04,.61,1.14) .3s
          z-index: 1 

      &:last-child
        &::before
          z-index: 0
  
    &__number
      display: flex
      align-items: center
      justify-content: center
      margin-bottom: 0.625rem
      width: 2.5rem
      height: 2.5rem
      background: #F5F7F9
      border-radius: 0.25rem
      color: #363636
      z-index: 2
      transition: all cubic-bezier(.7,-0.04,.61,1.14) .3s
      @include h3-opensans

    &__title
      max-width: 8.25rem
      text-align: center
      @include body-text-medium-4


  @keyframes scale
    0%
      transform: scale(1)
    50%
      transform: scale(1.15)
    100%
      transform: scale(1)

</style>
