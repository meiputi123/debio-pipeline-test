<style scoped lang="scss">
.pop-up-main{
    p {
        width: 504px;
        height: 54px;
        margin-bottom: 28px;
    }
    & > .password-field {
        width: 504px;
    }
}
</style>

<template lang="pug">
     LandingPagePopUp(:previous='previous')
        template(v-slot:header) Set Your Password
        template(v-slot:main): div.pop-up-main
            p You will need to input this password later when making transactions with this account.
            v-text-field(
                label="Type in your password"
                v-model="password"
                class="password-field"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :rules="[val => !!val || 'Password is required']"
                :disabled="isLoading"
                @click:append="showPassword = !showPassword"
                @keyup.enter="onPasswordSet"
                outlined
            )
            v-text-field(
                label="Confirm your password"
                v-model="passwordConfirm"
                class="password-field"
                :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPasswordConfirm ? 'text' : 'password'"
                :rules="[passwordConfirmRule]"
                :disabled="isLoading"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
                @keyup.enter="onPasswordSet"
                outlined
            )
            Recaptcha(
                :verify="onVerifyRecaptcha"
            )
            v-btn(
                :disabled="!buttonDisabled"
                class="white--text" 
                elevation="0" 
                color="primary" 
                :loading="isLoading"
                @click="register"
            ) Continue
</template>

<script>
import apiClientRequest from "@/common/lib/api"
import { mapActions, mapState, mapMutations } from "vuex"
import Recaptcha from "@/common/components/Recaptcha.vue"
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"

export default {
  name: "SetPassword",

  components: {
    LandingPagePopUp,
    Recaptcha
  },

  data: () => ({
    passwordsValid: false,
    password: "",
    passwordConfirm: "",
    showPassword: false,
    showPasswordConfirm: false,
    recaptchaVerified: false
  }),
  
  computed: {
    buttonDisabled(){
      return this.recaptchaVerified && this.isPasswordConfirmed
    },

    isPasswordConfirmed() {
      if(!!this.password && this.password == this.passwordConfirm) {
        return true
      }
      return false
    },

    passwordConfirmRule() {
      if(this.isPasswordConfirmed) {
        return true
      }
      return "Passwords must match."
    },
    
    ...mapState({
      substrateApi: (state) => state.substrate.api,
      isLoading: (state) => state.substrate.isLoadingWallet
    })
  },

  methods: {
    ...mapActions({
      registerMnemonic: "substrate/registerMnemonic"
    }),

    ...mapMutations({
      setIsLoading: "substrate/SET_LOADING_WALLET"
    }),

    previous() {
      this.$router.push({name: "generate-mnemonic"})
    },

    async register() {
      try {
        const result = await this.registerMnemonic({
          mnemonic: this.$route.params.mnemonic,
          password: this.password
        })
        if (!result.success) {
          throw("Mnemonic registration failed!")
        }
        this.$router.push({name: "registration-successful"})
      } 
      catch (err) {
        console.error(err)
      }
    },
    
    async onVerifyRecaptcha(response) {
      const result = await apiClientRequest.post("/recaptcha", { response }, {
        auth: {
          username: process.env.VUE_APP_USERNAME,
          password: process.env.VUE_APP_PASSWORD
        }
      })

      if (result.data.success) this.recaptchaVerified = true
    }
  }
}
</script>
