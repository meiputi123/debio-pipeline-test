<template lang="pug">
  .ui-debio-rating
    .ui-debio-rating__wrapper
      template(v-if="!interactive")
        svg(:height="size" viewBox="0 0 227 39" xmlns="http://www.w3.org/2000/svg")
          clipPath#stars
            path(d="M113.5 1.17665L119.073 13.0484L119.186 13.2897L119.45 13.3302L131.963 15.2534L122.892 24.5434L122.716 24.7241L122.757 24.9732L124.892 38.0641L113.742 31.8984L113.5 31.7646L113.258 31.8984L102.108 38.0641L104.243 24.9732L104.284 24.7241L104.108 24.5434L95.0371 15.2534L107.55 13.3302L107.814 13.2897L107.927 13.0484L113.5 1.17665Z" stroke="#FF56E0")
            path(d="M66.5 1.17665L72.0729 13.0484L72.1861 13.2897L72.4495 13.3302L84.9629 15.2534L75.8922 24.5434L75.7159 24.7241L75.7565 24.9732L77.8917 38.0641L66.742 31.8984L66.5 31.7646L66.258 31.8984L55.1083 38.0641L57.2435 24.9732L57.2841 24.7241L57.1078 24.5434L48.0371 15.2534L60.5505 13.3302L60.8139 13.2897L60.9271 13.0484L66.5 1.17665Z" stroke="#FF56E0")
            path(d="M19.5 1.17665L25.0729 13.0484L25.1861 13.2897L25.4495 13.3302L37.9629 15.2534L28.8922 24.5434L28.7159 24.7241L28.7565 24.9732L30.8917 38.0641L19.742 31.8984L19.5 31.7646L19.258 31.8984L8.10826 38.0641L10.2435 24.9732L10.2841 24.7241L10.1078 24.5434L1.0371 15.2534L13.5505 13.3302L13.8139 13.2897L13.9271 13.0484L19.5 1.17665Z" stroke="#FF56E0")
            path(d="M160.5 1.17665L166.073 13.0484L166.186 13.2897L166.45 13.3302L178.963 15.2534L169.892 24.5434L169.716 24.7241L169.757 24.9732L171.892 38.0641L160.742 31.8984L160.5 31.7646L160.258 31.8984L149.108 38.0641L151.243 24.9732L151.284 24.7241L151.108 24.5434L142.037 15.2534L154.55 13.3302L154.814 13.2897L154.927 13.0484L160.5 1.17665Z" stroke="#FF56E0")
            path(d="M207.5 1.17665L213.073 13.0484L213.186 13.2897L213.45 13.3302L225.963 15.2534L216.892 24.5434L216.716 24.7241L216.757 24.9732L218.892 38.0641L207.742 31.8984L207.5 31.7646L207.258 31.8984L196.108 38.0641L198.243 24.9732L198.284 24.7241L198.108 24.5434L189.037 15.2534L201.55 13.3302L201.814 13.2897L201.927 13.0484L207.5 1.17665Z" stroke="#FF56E0")
          rect(class="ui-debio-rating__background" clip-path="url(#stars)")
          rect(:width="`${computeRating * 20}%`" class="ui-debio-rating__value" clip-path="url(#stars)")
        p.ui-debio-rating__label.mb-0(v-if="withReviewers") ({{ totalReviews }})

      template(v-else)
        ui-debio-icon(
          v-for="star in interactiveStar"
          :key="`interactive ${star}`"
          :icon="starIcon"
          :size="size"
          role="button"
          fill
          stroke
          @click="handleClicked(star)"
        )
        ui-debio-icon(
          v-for="star in (totalRating - interactiveStar)"
          :key="`interactiveEmpty ${star}`"
          :icon="starIcon"
          :size="size"
          role="button"
          stroke
          @click="handleClicked(star + interactiveStar)"
        )
</template>

<script>
import { starIcon } from "@/common/icons"

export default {
  name: "UiDebioRating",

  props: {
    rating: { type: Number, default: 0, validator: val => val >= 0 },
    value: { type: Number, default: 0, validator: val => val >= 0 },
    totalRating: { type: Number, default: 5, validator: val => val >= 0 },
    totalReviews: { type: Number, default: 0, validator: val => val >= 0 },
    size: { type: [String, Number], default: 15 },

    interactive: { type: Boolean, default: false },
    withReviewers: { type: Boolean, default: true }
  },

  computed: {
    computeRating() {
      return this.rating > this.totalRating ? this.totalRating : this.rating
    },
    
    computeEmptyRating() {
      const calculate = this.totalRating - this.rating
      
      return calculate <= 0 ? 0 : calculate
    }
  },

  data: () => ({
    starIcon,

    interactiveStar: 0
  }),

  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val > this.totalRating) this.interactiveStar = this.totalRating
        else this.interactiveStar = val
      }
    }
  },

  methods: {
    handleClicked(star) {
      if (star === this.interactiveStar) this.interactiveStar = 0
      else this.interactiveStar = star

      this.$emit("input", this.interactiveStar)
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .ui-debio-rating
    &__wrapper
      display: flex
      align-items: center
      gap: .5rem

    &__label
      color: #757274
      @include body-text-5

    &__background
      fill: rgba(#F006CB, .18)
      height: 100%
      width: 100%

    &__value
      fill: #F006CB
      height: 100%
</style>
