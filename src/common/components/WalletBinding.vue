<template lang="pug">
  v-dialog(:value="show", width="500", persistent)
    v-card.pb-5
      v-app-bar(flat, dense, color="white")
        v-toolbar-title(v-if="putWallet")
        v-toolbar-title(v-if="!putWallet") Your Metamask
        v-spacer
        v-btn(icon @click="closeDialog")
          v-icon mdi-close
            
      div(v-if="loading")
        div.mt-10.mb-10(align="center")
          v-progress-circular(indeterminate, color="primary")

      div(v-if="!loading")
        div(v-if="putWallet")
          div(v-if="!inputPassword")        
            div(align="center") Connect to your Metamask!
              v-img.mt-5.mb-3(src="@/assets/metamask-icon.png" max-width="80")
              span.grey--text Metamask

            div(align="center" class="mt-5 grey--text") Haven't got a metamask wallet yet ?
            div(align="center" class="mt-5")
              a(href="https://docs.debio.network/getting-started"): u Learn How to Connect ?

            div.mb-5.ml-8.mr-8.mt-8
              v-btn(
                dark
                class="mt-5 align-center"
                outlined
                width="100%"
                large
                elevation="2"
                color="secondary" 
                @click="inputPassword = true"
              ) Connect

          div(class="mt-10 mb-2 ml-10 mr-10" v-if="inputPassword")      
            div(align="center") Input Debio Password
              v-text-field(
                class="mt-2"
                outlined
                auto-grow
                type="password"
                @keyup.enter="onSubmit"
                v-model="password"
                label="Input your password"
              )

              v-btn(
                depressed
                color="primary"
                large
                width="100%"
                @click="setWallet('metamask')") Continue
              v-alert(v-if="error" dense text type="error") {{ error }}              

        div.mt-10.mb-10.ml-10.mr-10(v-if="!putWallet")
          ui-debio-input(label="Your Address" ref="metamask" disabled :value="ethAccount[0].address" block)
            ui-debio-icon(
              slot="icon-append"
              :icon="copyIcon"
              view-box="0 0 40 40"
              stroke
              color="#5640A5"
              size="20"
              role="button"
              @click="copyToClipboard(ethAccount[0].address)"
            )
          
          v-row(class="mt-5 d-flex")
            v-col(class="justify-start" ) DAI Balance
            template
              ui-debio-icon.mr-2(:icon="daiIcon" size="14" )
              span.mr-5 {{ balance }}
    
          
          v-btn(
            class="mt-5 align-center"
            outlined
            color="secondary"
            width="100%"
            large
            light
            @click="disconnectWallet"
          ) Disconnect Wallet            
</template>

<script>
import { mapState, mapMutations } from "vuex"
import { handleSetWallet } from "@/common/lib/wallet"
import { serviceHandlerMixin } from "@/common/lib/polkadot-provider"
import localStorage from "@/common/lib/local-storage"
import Button from "@/common/components/Button"
import { daiIcon, copyIcon } from "@/common/icons"
import { getBalanceDAI } from "@/common/lib/metamask/wallet"



export default {
  name: "WalletBinding",

  components: {
    Button
  },

  props: {
    show: Boolean
  },

  mixins: [serviceHandlerMixin],

  data: () => ({
    error: "",
    password: "",
    putWallet: true,
    loading: false,
    ethAccount: null,
    inputPassword: false,
    address: "",
    copyIcon,
    daiIcon,
    balance: 0
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress
    })
  },

  methods: {

    ...mapMutations({
      setMetamaskAddress: "metamask/SET_WALLET_ADDRESS"
    }),

    async setWallet(walletName) {
      this.ethAccount = null
      this.loading = true
      this.ethAccount = await handleSetWallet(walletName, this.metamaskWalletAddress)

      try {
        if (this.wallet.isLocked) {
          await this.wallet.decodePkcs8(this.password)
        } 
        const accountId = localStorage.getAddress()
        const ethAddress = this.ethAccount[0].address

        await this.$store.dispatch("wallet/walletBinding", {accountId, ethAddress})
        this.setMetamaskAddress(this.ethAccount[0].address)
        this.balance = await getBalanceDAI(this.ethAccount[0].address)

        this.loading = false
        this.putWallet = false
      } 
      catch (err) {
        console.log(err.message)
        this.loading = false
        this.error = err.message
      }
    },

    disconnectWallet () {
      this.error = ""
      this.loading = false
      this.putWallet = true
      this.inputPassword = false
      this.ethAccount = null
      this.$emit("close")
    },

    closeDialog() {
      this.error = ""
      this.loading = false
      this.putWallet = true
      this.inputPassword = false
      if (this.ethAccount) {
        this.$emit("success")
      } else {
        this.$emit("close")
      }
    },
    
    async copyToClipboard(text) {
      await navigator.clipboard.writeText(text)
    }
  }
}
</script>
