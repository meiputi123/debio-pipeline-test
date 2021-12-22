<template>
    <vue-recaptcha @verify="verify" :sitekey="sitekey" :loadRecaptchaScript="true"></vue-recaptcha>
</template>

<script>
import VueRecaptcha from "vue-recaptcha"

export default {
  name: "Recaptcha",

  props: {
    verify: Function
  },
    
  components: {
    VueRecaptcha
  },

  computed: {
    sitekey() {
      return process.env.VUE_APP_RECAPTCHA_SITE_KEY
    }
  }
}
</script>
