<template lang="pug">
  .layout-dashboard
    ui-debio-modal(
      :show="showModalPassword"
      title="Unlock Wallet by Input your password"
      :icon="checkCircleIcon"
      :showCta="!success"
      :showTitle="!success"
      disable-dismiss
    )
      ui-debio-input(
        v-if="!success"
        :error="!!error"
        :errorMessages="!!error ? error.message : null"
        :rules="$options.rules.password"
        :type="showPassword ? 'text' : 'password'"
        variant="small"
        placeholder="Input Password"
        v-model="password"
        outlined
        block
        validate-on-blur
        @keyup.enter="handleSubmitPassword"
        @blur="error = null"
        @isError="handleError"
      )
        ui-debio-icon(
          slot="icon-append"
          role="button"
          size="18"
          @click="handleShowPassword"
          :icon="showPassword ? eyeIcon : eyeOffIcon"
          stroke
        )

      .modal-password__cta.d-flex(slot="cta")
        Button(
          block
          color="secondary"
          @click="handleSubmitPassword"
        ) Submit

    NavigationDrawer.layout-dashboard__sidebar(:items="computeNavs")
      Button(
        outlined
        height="35px"
        @click="goToRequestTestPage"
        class="font-weight-bold sidebar-text mt-4 dg-raleway-font"
        color="primary"
      ) Request a Test

      Button(
        outlined
        height="35px"
        @click="goToUploadEMR"
        class="font-weight-bold sidebar-text mt-4 dg-raleway-font"
        color="primary"
      ) Upload EMR

    .layout-dashboard__wrapper
      Navbar.layout-dashboard__navbar(:error="pageError" :notifications="localListNotification")
      .layout-dashboard__main
        transition(name="transition-slide-x" mode="out-in")
          maintenancePageLayout(v-if="pageError" :error="pageError")
          router-view(v-else @onPageError="handlePageError")
</template>

<script>
import { mapState } from "vuex"
import store from "@/store"
import { validateForms } from "@/common/lib/validate"
import {
  gridIcon,
  boxIcon,
  eyeIcon,
  eyeOffIcon,
  databaseIcon,
  checkCircleIcon,
  fileTextIcon,
  creditCardIcon
} from "@/common/icons"

import NavigationDrawer from "@/common/components/NavigationDrawer"
import Navbar from "@/common/components/Navbar.vue"
import Button from "@/common/components/Button"
import maintenancePageLayout from "@/views/Dashboard/Customer/maintenancePageLayout"
import errorMessage from "@/common/constants/error-messages"

export default {
  name: "MainPage",

  mixins: [validateForms],

  components: { NavigationDrawer, Navbar, Button, maintenancePageLayout },

  data: () => ({
    checkCircleIcon,
    eyeIcon,
    eyeOffIcon,

    showModalPassword: false,
    pageError: null,
    showPassword: false,
    success: false,
    error: null,
    password: null,

    navs: [
      { text: "Dashboard", disabled: false, active: false, route: "customer-dashboard", icon: gridIcon },
      { text: "My Test", disabled: false, active: false, route: "my-test", icon: boxIcon },
      { text: "My EMR", disabled: false, active: false, route: "customer-emr", icon: fileTextIcon },
      { text: "Data Bounty", disabled: false, active: false, route: "customer-data-bounty", icon: databaseIcon },
      { text: "Payment History", disabled: false, active: false, route: "customer-payment-history", icon: creditCardIcon }
    ]
  }),

  computed: {
    ...mapState({
      lastEventData: (state) => state.substrate.lastEventData,
      wallet: (state) => state.substrate.wallet,
      localListNotification: (state) => state.substrate.localListNotification,
      mnemonicData: (state) => state.substrate.mnemonicData
    }),

    computeNavs() {
      const setActive = name => {
        return (
          this.$route.name === name ||
          this.$route.meta.parent === name
        )
      }

      return this.navs.map(nav => ({ ...nav, active: setActive(nav.route) }))
    },

    computeButtonActive() {
      return !/(\/customer\/request-test)/.test(this.$route.path)
    }
  },

  watch: {
    $route() {
      this.pageError = null
    },

    lastEventData(event) {
      if (event !== null) {
        this.$store.dispatch("substrate/addListNotification", {
          address: this.wallet.address,
          event: event,
          role: "customer"
        });
      }
    }
  },

  async mounted() {
    if (!this.mnemonicData) this.showModalPassword = true
    await this.getListNotification()
  },

  rules: {
    password: [ val => !!val || errorMessage.PASSWORD(8) ]
  },

  methods: {
    handlePageError(error) {
      this.pageError = error
    },

    async getListNotification() {
      await this.$store.dispatch("substrate/getListNotification", {
        address: this.wallet.address,
        role: "customer"
      })
    },

    goToRequestTestPage() {
      this.$router.push({ name: "customer-request-test" })
    },

    goToUploadEMR() {
      this.$router.push({ name: "customer-emr-create" })
    },

    handleShowPassword() {
      this.showPassword = !this.showPassword
    },

    async handleSubmitPassword() {
      try {
        await this.wallet.unlock(this.password)
        await store.dispatch("substrate/getEncryptedAccountData", {
          password: this.password
        })

        this.success = true

        setTimeout(() => {
          this.showModalPassword = false
        }, 1300)
      } catch (e) {
        this.error = e
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .layout-dashboard
    width: 100%
    min-height: 100vh
    background: #F5F7F9
    display: flex

    &__wrapper
      width: 70%
      flex: 1
      display: flex
      flex-direction: column

    &__navbar
      padding: 2.5rem 1.563rem 1.563rem !important

    &__main
      padding: 0 1.563rem 1.563rem !important

  .modal-password
    &__cta
      gap: 20px
  
  .transition-slide-x
    &-enter-active,
    &-leave-active
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &-enter
      opacity: 0
      transform: translateX(1.563rem)

    &-leave-to
      opacity: 0
      transform: translateX(-12.813rem)
</style>
