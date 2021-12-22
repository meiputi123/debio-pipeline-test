<template lang="pug">
  .modal-bounty
    ui-debio-modal(:show="show" :show-cta="false" :show-title="false" disable-dismiss)
      .modal-bounty__wrapper
        .modal-bounty__illustration
          ui-debio-icon(
            :class="{ 'ui-debio-icon--animated': loading }"
            :icon="doctorsIllustration"
            view-box="0 0 281 173"
            width="295"
            height="188"
          )
        .modal-bounty__body
          .modal-bounty__title {{ computeModalText }}
          .modal-bounty__progress(v-if="loading")
          template(v-else)
            .modal-bounty__subtitle
              | {{ subTitle }} 
              router-link(:to="link" v-if="link") here
            slot
</template>

<script>
import { doctorsIllustration } from "@/common/icons"

export default {
  name: "modalBounty",

  props: {
    title: { type: String, default: "" },
    link: { type: [String, Object], default: null },
    subTitle: { type: String, default: null },
    show: Boolean,
    loading: Boolean
  },

  data: () => ({ doctorsIllustration }),

  computed: {
    computeModalText() {
      return this.loading
        ? "It takes a while, please do not refresh the page"
        : this.title
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .modal-bounty
    &__wrapper
      max-width: 439px

    &__illustration
      height: 212px
      display: flex
      justify-content: center
      align-items: flex-end
      overflow: hidden
      background: linear-gradient(235.92deg, #EEBEFF 13.56%, rgba(190, 6, 255, 0.58) 70.18%)
      border-radius: 14px 14px 0 0

      > .ui-debio-icon
        margin-bottom: -6px

    &__body
      padding: 32px 40px 40px

    &__title
      text-align: center
      margin-bottom: 25px
      @include h3-opensans

    &__subtitle
      text-align: center
      @include body-text-4-opensans

    &__progress
      width: 100%
      height: 1rem
      background: #EDF2F7
      border-radius: 1rem
      overflow: hidden

      &::before
        content: ""
        display: block
        width: 10%
        height: 100%
        background: #FF92AE
        border-radius: 1rem
        animation: loading infinite 1s

    &::v-deep
      .ui-debio-modal__card
        border-radius: 14px
        padding: 0

      .ui-debio-icon--animated
        animation: illustrationAnimation 3s
        
        #paper
          animation: illustrationAnimation ease-in-out infinite 1.5s alternate
          animation-delay: .3s

        #thumb
          animation: illustrationAnimation ease-in-out infinite 1.5s alternate
          animation-delay: .8s

        #heart
          animation: illustrationAnimation ease-in-out infinite 1.5s alternate
          animation-delay: .5s

        #plusicon
          animation: illustrationAnimation ease-in-out infinite 1.5s alternate
          animation-delay: .2s

        #bottle
          animation: illustrationAnimation ease-in-out infinite 1.5s alternate
          animation-delay: .7s

                
    @keyframes illustrationAnimation
      0%
        opacity: 0
        transform: translateY(-3px)
      50%
        transform: translateY(8px)
      100%
        transform: translateY(0px)
    
    @keyframes loading
      0%
        width: 0%
        transform: translateX(-100%)
      25%
        width: 20%
      50%
        width: 40%
      75%
        width: 95%
      100%
        width: 100%
        transform: translateX(100%)
    
    &::v-deep
      .ui-debio-modal__card
        border-radius: 14px
        padding: 0
</style>
