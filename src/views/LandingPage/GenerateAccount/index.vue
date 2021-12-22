<style scoped lang="scss">
.v-input--checkbox {
    width: 437px;
    height: 53px;
    font-family: Raleway;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 150%;
    display: flex;
    align-items: center;

    #checkboxLabel {
      font-size: 18px;
      line-height: 150%;
      margin-left: 20px;
      font-family: Raleway;
    }
}
.m1{
  margin: 23px 0px;
}
.m40{
  margin-bottom: 40px;
}
.mt20{
  margin-top: 20px;
}
.link{
  text-decoration: none;
}
</style>

<template lang="pug">
  LandingPagePopUp(:previous='previous')
    template(v-slot:header) Backup your account
    template(v-slot:main)
      h3.m1 We will give you 12 words that allows you to recover an account
      p.m40 You need to carefully save the  words. Copy-paste it, screenshot it, write it down, and keep it safe. If you lose it, we won't be able to help you recover it.
      v-checkbox(v-model="agreeConditions"): template(v-slot:label): div#checkboxLabel I understand with DeBio 
        v-tooltip(bottom)
          template(v-slot:activator="{ on }")
            a.link(target="_blank"
              href="https://docs.debio.network/legal/privacy-policy"
              @click.stop
            ) Privacy Policy
            span  and 
            a.link(target="_blank"
              href="https://docs.debio.network/legal/terms-and-condition"
              @click.stop
            ) terms and condition
      .button.mt20
        v-btn(elevation='0' color='primary' :disabled="!agreeConditions" @click="generateMnemonic") Continue
</template>

<script>
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"

export default {
  name: "GenerateAccount",
  components: {
    LandingPagePopUp
  },
  data: () => ({
    agreeConditions: false
  }),
  methods: {
    previous() {
      this.$router.push({name: "landing-page"})
    },

    generateMnemonic() {
      this.$router.push({name: "generate-mnemonic"})
    }
  }
}
</script>
